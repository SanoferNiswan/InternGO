import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const SignUp = () => {
  const SIGNUP_URL = "/api/auth/send-otp";
  const VERIFY_OTP_URL = "/api/auth/verify-otp";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() === ""
          ? "Name is required."
          : value.trim().length < 5
          ? "Name must be at least 5 characters long."
          : /^[A-Za-z\s]+$/.test(value)
          ? ""
          : "Name should contain only alphabets and spaces.";
      case "email":
        if (value.trim() === "") return "Email is required.";
        const emailRegex = /^[^\s@]+@(finestcoder\.com|codingmart\.com)$/;
        return emailRegex.test(value)
          ? ""
          : "Invalid email domain. Use @finestcoder.com or @codingmart.com.";
      case "password":
        if (value.trim() === "") return "Password is required.";
        if (value.length < 8)
          return "Password must be at least 8 characters long.";
        if (!/[A-Z]/.test(value))
          return "Password must include at least 1 uppercase letter.";
        if (!/[a-z]/.test(value))
          return "Password must include at least 1 lowercase letter.";
        if (!/[0-9]/.test(value))
          return "Password must include at least 1 number.";
        if (!/[@$!%*?&]/.test(value))
          return "Password must include at least 1 special character.";
        return "";
      case "confirmPassword":
        if (value.trim() === "") return "Please confirm your password.";
        return value === formData.password ? "" : "Passwords do not match.";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => !error);
    if (isValid) {
      try {
        const { confirmPassword, ...data } = formData;
        const response = await axios.post(SIGNUP_URL, data);
        console.log(response);
        

        if (response.data.statusCode === 200) {
          toast.success("OTP sent to your email.");
          setUserEmail(formData.email);
          setShowOtpForm(true);
        }
      } catch (error) {
        if (error.response) {
          console.log(error);
          
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          toast.error("Network error, please try again later.");
        }
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 4) {
      toast.error("Invalid OTP. Must be 4 digits.");
      return;
    }

    try {
      const response = await axios.post(VERIFY_OTP_URL, {
        email: userEmail,
        otp,
      });

      console.log(response);
      

      if (response.data.statusCode === 201) {
        toast.success("OTP Verified successfully");
        navigate("/signin");
      }
    } catch (error) {
      console.log(error);
      
      toast.error(JSON.stringify(error.response?.data?.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-5 bg-white rounded-lg shadow-md">
        {!showOtpForm ? (
          <>
            <div className="relative flex justify-center mb-8">
              <div className="absolute w-14 h-14 bg-blue-200 rounded-full opacity-50 -top-2"></div>
              <div className="absolute w-10 h-10 bg-blue-300 rounded-full opacity-30 -left-3"></div>
              <div className="absolute w-18 h-5 bg-blue-400 opacity-20 -bottom-3 rotate-45"></div>
              <div className="absolute w-5 h-5 bg-blue-500 rounded-full opacity-40 -right-2 top-2"></div>
              <div className="absolute w-20 h-1 bg-blue-600 opacity-50 -bottom-5"></div>

              <FaUserPlus className="text-4xl text-blue-600 relative z-10" />
            </div>
            <h2 className="text-center text-xl font-bold mb-4">Sign Up</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full h-10 p-2 rounded border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:ring-primary`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-10 p-2 rounded border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-primary`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full h-10 p-2 rounded border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:ring-primary`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full h-10 p-2 rounded border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-primary`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </button>

              <p className="text-center text-sm text-gray-700 mt-3">
                Already have an account?{" "}
                <NavLink to="/signin" className="text-blue-600 hover:underline">
                  Sign In
                </NavLink>
              </p>
            </form>
          </>
        ) : (
          <form className="space-y-4" onSubmit={handleOtpSubmit}>
            <h2 className="text-center text-xl font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-10 p-2 rounded border border-gray-300 focus:ring-primary"
              maxLength={6}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Confirm OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;

// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import { FaUserPlus } from "react-icons/fa";
// import { toast } from "react-toastify";

// const SignUp = () => {
//   const SIGNUP_URL = "/api/auth/signup";
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     switch (name) {
//       case "name":
//         return value.trim() === ""
//           ? "Name is required."
//           : value.trim().length < 5
//           ? "Name must be at least 5 characters long."
//           : /^[A-Za-z\s]+$/.test(value)
//           ? ""
//           : "Name should contain only alphabets and spaces.";
//       case "email":
//         if (value.trim() === "") return "Email is required.";
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(value) ? "" : "Invalid email format.";
//       case "password":
//         if (value.trim() === "") return "Password is required.";
//         if (value.length < 8)
//           return "Password must be at least 8 characters long.";
//         if (!/[A-Z]/.test(value))
//           return "Password must include at least 1 uppercase letter.";
//         if (!/[a-z]/.test(value))
//           return "Password must include at least 1 lowercase letter.";
//         if (!/[0-9]/.test(value))
//           return "Password must include at least 1 number.";
//         if (!/[@$!%*?&]/.test(value))
//           return "Password must include at least 1 special character.";
//         return "";
//       case "confirmPassword":
//         if (value.trim() === "") return "Please confirm your password.";
//         return value === formData.password ? "" : "Passwords do not match.";
//       default:
//         return "";
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const error = validateField(name, value);
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};
//     Object.keys(formData).forEach((field) => {
//       newErrors[field] = validateField(field, formData[field]);
//     });
//     setErrors(newErrors);

//     const isValid = Object.values(newErrors).every((error) => !error);
//     if (isValid) {
//       try {
//         const { confirmPassword, ...data } = formData;

//         const response = await axios.post(SIGNUP_URL, data);

//         if (response.data.statusCode === 201) {
//           toast.success(response.data.message);
//           navigate("/signin");
//         }
//       } catch (error) {
//         if (error.response) {
//           toast.error(`Error: ${error.response.data.message}`);
//         } else {
//           toast.error("Network error, please try again later.");
//         }
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// <div className="w-full max-w-sm h-[550px] p-5 bg-white rounded-lg shadow-md overflow-y-auto mt-6 mb-6">
//   <div className="relative flex justify-center mb-8">
//     <div className="absolute w-14 h-14 bg-blue-200 rounded-full opacity-50 -top-2"></div>
//     <div className="absolute w-10 h-10 bg-blue-300 rounded-full opacity-30 -left-3"></div>
//     <div className="absolute w-18 h-5 bg-blue-400 opacity-20 -bottom-3 rotate-45"></div>
//     <div className="absolute w-5 h-5 bg-blue-500 rounded-full opacity-40 -right-2 top-2"></div>
//     <div className="absolute w-20 h-1 bg-blue-600 opacity-50 -bottom-5"></div>

//     <FaUserPlus className="text-4xl text-blue-600 relative z-10" />
//   </div>
//         <h2 className="text-center text-xl font-bold mb-4">Sign Up</h2>
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`w-full h-10 p-2 rounded border ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-2 ${
//                 errors.name ? "focus:ring-red-500" : "focus:ring-primary"
//               }`}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm">{errors.name}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full h-10 p-2 rounded border ${
//                 errors.email ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-2 ${
//                 errors.email ? "focus:ring-red-500" : "focus:ring-primary"
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full h-10 p-2 rounded border ${
//                   errors.password ? "border-red-500" : "border-gray-300"
//                 } focus:outline-none focus:ring-2 ${
//                   errors.password ? "focus:ring-red-500" : "focus:ring-primary"
//                 }`}
//               />
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm">{errors.password}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`w-full h-10 p-2 rounded border ${
//                   errors.confirmPassword ? "border-red-500" : "border-gray-300"
//                 } focus:outline-none focus:ring-2 ${
//                   errors.confirmPassword
//                     ? "focus:ring-red-500"
//                     : "focus:ring-primary"
//                 }`}
//               />
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             Sign Up
//           </button>

// <p className="text-center text-sm text-gray-700 mt-3">
//   Already have an account?{" "}
//   <NavLink to="/signin" className="text-blue-600 hover:underline">
//     Sign In
//   </NavLink>
// </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
