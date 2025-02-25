import React, { useState } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddUserModal = ({ onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

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
          : "Email must be from finestcoder.com or codingmart.com.";

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

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    const errorMsg = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newErrors = {
        name: validateField("name", userData.name),
        email: validateField("email", userData.email),
        password: validateField("password", userData.password),
      };

      setErrors(newErrors);

      if (Object.values(newErrors).some((error) => error !== "")) {
        toast.error("Please enter valid values");
        return;
      }

      const response = await axios.post("/api/auth/createUser", userData);
      console.log(response);
      toast.success("User added successfully!");
      setTimeout(onClose, 500);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder=" "
              value={userData.name}
              onChange={handleChange}
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              required
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Full Name
            </label>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={userData.email}
              onChange={handleChange}
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              required
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Email
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={userData.password}
              onChange={handleChange}
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              required
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Password
            </label>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="">Select Role</option>
              <option value="Mentors">Mentors</option>
              <option value="Admins">Admins</option>
              <option value="Interns">Interns</option>
            </select>
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Role
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
