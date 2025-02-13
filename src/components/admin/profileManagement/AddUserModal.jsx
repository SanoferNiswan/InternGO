import React, { useState } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";

const AddUserModal = ({ onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/createUser", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User created:", response.data);
      alert("User added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
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
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Full Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={userData.email}
              onChange={handleChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={userData.password}
              onChange={handleChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Password
            </label>
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
