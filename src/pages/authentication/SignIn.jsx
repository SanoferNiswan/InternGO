import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import GLogin from "../../components/authentication/GLogin";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
        console.log(user);
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Sign In Error:", error.response.data.message);
      setErrMsg((error.response?.data?.message) || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg shadow-gray-400">
        <h2 className="text-center text-2xl font-bold mb-4">Sign In</h2>
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
                className="w-full p-2 pr-10 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-primary"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
          <GLogin />
          <p className="text-sm text-center text-gray-700 mt-4">
            Don't have an account?{" "}
            <NavLink
              className="text-blue-600 hover:underline cursor-pointer"
              to={"/signup"}
            >
              Sign Up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
