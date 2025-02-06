import React from "react";
import { FaUsers, FaClipboardList, FaTasks, FaChartBar, FaProjectDiagram, FaFileAlt } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaUsers className="text-blue-500 text-4xl" />
          <div>
            <p className="text-gray-500">Total Interns</p>
            <h2 className="text-2xl font-bold">120</h2>
          </div>
        </div>
 
        {/* Active Interns */}
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaClipboardList className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500">Active Interns</p>
            <h2 className="text-2xl font-bold">100</h2>
          </div>
        </div>

        {/* Total Projects */}
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaProjectDiagram className="text-purple-500 text-4xl" />
          <div>
            <p className="text-gray-500">Non Active Interns</p>
            <h2 className="text-2xl font-bold">20</h2>
          </div>
        </div>

        {/* Reports Generated */}
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaFileAlt className="text-red-500 text-4xl" />
          <div>
            <p className="text-gray-500">Total task updates</p>
            <h2 className="text-2xl font-bold">58</h2>
          </div>
        </div>

        {/* Tasks Completed
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaTasks className="text-yellow-500 text-4xl" />
          <div>
            <p className="text-gray-500">Tasks Completed</p>
            <h2 className="text-2xl font-bold">230</h2>
          </div>
        </div> */}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          <li className="flex items-center justify-between text-gray-600">
            <span>New mentor profile added</span>
            <span className="text-sm text-gray-400">5 hours ago</span>
          </li>
          <li className="flex items-center justify-between text-gray-600">
            <span>Selvam completed interaction</span>
            <span className="text-sm text-gray-400">1 day ago</span>
          </li>
          <li className="flex items-center justify-between text-gray-600">
            <span>Review session completed</span>
            <span className="text-sm text-gray-400">2 days ago</span>
          </li>
        </ul>
      </div>



      {/* User Management Table */}
      <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4">User Management</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">User</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">John Doe</td>
              <td className="border border-gray-300 px-4 py-2">Admin</td>
              <td className="border border-gray-300 px-4 py-2 text-green-500">Active</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">Remove</button>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
              <td className="border border-gray-300 px-4 py-2">Intern</td>
              <td className="border border-gray-300 px-4 py-2 text-yellow-500">Pending</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
