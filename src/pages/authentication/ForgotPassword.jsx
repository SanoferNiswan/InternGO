import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast.error("Email must not be empty");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(`/api/auth/forgot-password`, { email });
      setSubmitted(true);
    } catch (error) {
      if (error) {
        toast.error(JSON.stringify(error.response?.data?.message));
      } else {
        toast.error("network error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!submitted ? (
          <>
            <div className="relative flex justify-center mb-5">
              <div className="absolute w-16 h-16 bg-blue-200 rounded-full opacity-50 -top-2"></div>
              <div className="absolute w-12 h-12 bg-blue-300 rounded-full opacity-30 -left-3"></div>
              <div className="absolute w-20 h-6 bg-blue-400 opacity-20 -bottom-3 rotate-45"></div>
              <div className="absolute w-6 h-6 bg-blue-500 rounded-full opacity-40 -right-2 top-2"></div>
              <div className="absolute w-24 h-1 bg-blue-600 opacity-50 -bottom-6"></div>

              <FaExclamationCircle className="text-5xl text-blue-600 relative z-10" />
            </div>

            <h2 className="text-lg font-semibold text-center mb-4">
              Forgot Password
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
            <div
              onClick={() => navigate("/signin")}
              className="text-blue-500 hover:text-blue-700 cursor-pointer text-sm font-medium mt-4 text-center"
            >
              &lt; Back to Login Page
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-green-600">
              We sent a reset link to your mail
            </h2>
            <p className="text-gray-600 mt-2">
              Thanks from <strong className="text-blue-500">InternGO</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
