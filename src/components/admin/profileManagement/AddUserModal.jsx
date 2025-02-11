import React, { useState } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";

const AddUserModal = ({ onClose }) => {
    const {token} = useSelector((state)=>state.auth)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Interns",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/createUser", userData,{
        headers:{
            Authorization:`Bearer ${token}`
        }
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            required
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            required
          />
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          >
            <option value="Mentors">Mentors</option>
            <option value="Admins">Admins</option>
            <option value="Interns">Interns</option>
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
