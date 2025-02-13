import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import AddUserModal from "./AddUserModal";

const AddUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-end p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        <FaUserPlus /> Add User
      </button>

      {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} />}
    </div>
  ); 
};

export default AddUser;
