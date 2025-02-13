import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
  const navigate = useNavigate();
   
  return (
    <div
      key={user.id}
      className="relative flex flex-col items-center bg-white shadow-lg p-6 rounded-lg cursor-pointer 
             hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-64 h-72 justify-between"
      onClick={() => navigate(`/admin/resources/${user.id}`)}
    >
      <div
        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
          ["SHADOWING", "DEPLOYED", "ACTIVE"].includes(user.status)
            ? "bg-green-200 text-green-700"
            : "bg-red-200 text-red-700"
        }`}
      >
        {user.status || "Not Updated"}
      </div>

      <img
        src={
          user.profilePhoto ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        alt="profile"
        className="w-24 h-24 rounded-full object-cover mt-3 mb-3 border-2 border-gray-300"
      />

      {/* Employee ID */}
      <p className="text-sm text-gray-500 font-semibold">
        Emp ID: {user.employeeId || "Not Provided"}
      </p>

      {/* User Details */}
      <div className="flex flex-col items-center mt-2 text-center">
        <p className="text-lg font-bold">{user.name || "---"}</p>
        <p className="text-sm text-gray-700">
          {user.year || "---"} - {user.batch || "---"}
        </p>
        {/* <p className="text-sm text-gray-700">{user.phase || "---"}</p> */}
        <p className="mt-2 text-blue-600 font-semibold">
          {user.designation || "---"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;

