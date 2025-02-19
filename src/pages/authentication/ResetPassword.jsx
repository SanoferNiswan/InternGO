import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isValid, setIsValid] = useState(null);
  const token = searchParams.get("token");
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, token);

  const verifyToken = async () => {
    try {
      await axios.post(`/api/auth/verify`, { token });
      setIsValid(true);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setIsValid(false);
      }
    }finally{
      setLoading(false);
    }
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = (field, value) => {
    const newErrors = { ...errors };

    if (field === "password") {
      if (!value.trim()) {
        newErrors.password = "Password is required.";
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password =
          "Password must include at least 1 uppercase letter.";
      } else if (!/[a-z]/.test(value)) {
        newErrors.password =
          "Password must include at least 1 lowercase letter.";
      } else if (!/[0-9]/.test(value)) {
        newErrors.password = "Password must include at least 1 number.";
      } else if (!/[@$!%*?&]/.test(value)) {
        newErrors.password =
          "Password must include at least 1 special character.";
      } else {
        delete newErrors.password;
      }

      if (confirmPassword && value !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (field === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (password !== value) {
        newErrors.confirmPassword = "Passwords do not match.";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const resetPassword = async () => {
    if (Object.keys(errors).length > 0 || !password || !confirmPassword) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "/api/auth/reset-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      toast.success("Password reset successfully!");
      navigate("/signin", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if(loading){
    <Loader />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isValid ? (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md shadow-gray-400">
          <h2 className="text-xl font-semibold text-center mb-4">
            Reset Password
          </h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetPassword();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className={`p-2 border rounded w-full focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateFields("password", e.target.value);
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className={`p-2 border rounded w-full focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateFields("confirmPassword", e.target.value);
                }}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`p-2 rounded-md text-white font-semibold ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Reset Password"}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-2xl font-bold text-red-600">Token Expired</h1>
          <button
            onClick={() => navigate("/signin")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
