import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import GLogin from "../../components/authentication/GLogin";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const SignIn = () => {
  const dispatch = useDispatch();
  const SIGNIN_URL = "/api/auth/signin";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errmsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SIGNIN_URL, formData);
      if (response.data) {
        const user = response.data.data;
        const { userId, name, token, role, permissions, profilePhoto } = user;

        if (token) {
          dispatch(
            setAuth({
              user,
              userId,
              name,
              token,
              role,
              permissions,
              profilePhoto,
            })
          );

          navigate("/dashboard", { replace: true });
        }
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setErrMsg(
        JSON.stringify(error.response?.data?.message) || "An error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-md shadow-gray-400">
        <div className="relative flex justify-center mb-6">
          <div className="absolute w-12 h-12 bg-blue-200 rounded-full opacity-50 -top-2"></div>
          <div className="absolute w-10 h-10 bg-blue-300 rounded-full opacity-30 -left-2"></div>
          <div className="absolute w-16 h-4 bg-blue-400 opacity-20 -bottom-2 rotate-45"></div>
          <div className="absolute w-5 h-5 bg-blue-500 rounded-full opacity-40 -right-2 top-2"></div>
          <div className="absolute w-20 h-1 bg-blue-600 opacity-50 -bottom-4"></div>
          <FaSignInAlt className="text-4xl text-blue-600 relative z-10" />
        </div>
        <h2 className="text-center text-xl font-bold mb-3">Sign In</h2>
        {errmsg && <p className="text-red-700 mb-2">{errmsg}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 pr-8 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-primary"
                required
              />
              <span
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <GLogin />
          <p className="text-xs text-center text-gray-700 mt-3">
            <NavLink
              className="text-blue-600 hover:underline"
              to="/forgot-password"
            >
              Forgot password?
            </NavLink>
          </p>
          <p className="text-sm text-center text-gray-700 mt-2">
            Don't have an account?{" "}
            <NavLink className="text-blue-600 hover:underline" to="/signup">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
