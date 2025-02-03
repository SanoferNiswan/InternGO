import React from "react";
import { FaBook, FaTasks, FaCheckCircle, FaBullhorn, FaClock } from "react-icons/fa";

const InternDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Intern Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaBook className="text-blue-500 text-4xl" />
          <div>
            <p className="text-gray-500">Modules Completed</p>
            <h2 className="text-2xl font-bold">5</h2>
          </div>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaTasks className="text-yellow-500 text-4xl" />
          <div>
            <p className="text-gray-500">Pending Tasks</p>
            <h2 className="text-2xl font-bold">3</h2>
          </div>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaCheckCircle className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500">Tasks Completed</p>
            <h2 className="text-2xl font-bold">12</h2>
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaBullhorn className="text-red-500" /> Announcements
        </h2>
        <p className="text-gray-600">Meeting at 3 PM regarding final project submissions.</p>
      </div>

      {/* Training Status */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-gray-500">Status</h3>
          <p className="text-lg font-bold text-green-500">Green Zone</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-gray-500">Training Phase</h3>
          <p className="text-lg font-bold text-blue-500">Phase 2 - React Development</p>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaClock className="text-blue-500" /> Today's Tasks
        </h2>
        <ul className="space-y-4">
          <li className="flex items-center justify-between text-gray-600">
            <span>Complete API Integration</span>
            <span className="text-sm text-gray-400">Due by 6 PM</span>
          </li>
          <li className="flex items-center justify-between text-gray-600">
            <span>Work on UI improvements</span>
            <span className="text-sm text-gray-400">Due by 4 PM</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InternDashboard;
