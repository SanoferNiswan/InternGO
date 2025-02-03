import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import InternDashboard from "./InternDashboard";

const Dashboard = () => {
  const { role } = useSelector((state) => state.auth); // Get user role from Redux state

  return (
    <div className="p-6">
      {role === "Admins" ? <AdminDashboard /> : role === "Interns" ? <InternDashboard /> : 
        <p className="text-red-500 text-lg font-semibold">Unauthorized Access</p>}
    </div>
  );
};

export default Dashboard;



// import React from "react";
// import { FaUsers, FaClipboardList, FaTasks, FaChartBar } from "react-icons/fa";

// const Dashboard = () => {
//   return (
//     <div className="p-6">

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
//           <FaUsers className="text-blue-500 text-4xl" />
//           <div>
//             <p className="text-gray-500">Total Users</p>
//             <h2 className="text-2xl font-bold">120</h2>
//           </div>
//         </div>

//         <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
//           <FaClipboardList className="text-green-500 text-4xl" />
//           <div>
//             <p className="text-gray-500">Active Users</p>
//             <h2 className="text-2xl font-bold">85</h2>
//           </div>
//         </div>

//         <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
//           <FaTasks className="text-yellow-500 text-4xl" />
//           <div>
//             <p className="text-gray-500">Pending Tasks</p>
//             <h2 className="text-2xl font-bold">32</h2>
//           </div>
//         </div>

//         <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
//           <FaChartBar className="text-red-500 text-4xl" />
//           <div>
//             <p className="text-gray-500">Reports Generated</p>
//             <h2 className="text-2xl font-bold">47</h2>
//           </div>
//         </div>
//       </div>

//       <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
//         <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Activity</h2>
//         <ul className="space-y-4">
//           <li className="flex items-center justify-between text-gray-600">
//             <span>John Doe updated profile information</span>
//             <span className="text-sm text-gray-400">2 hours ago</span>
//           </li>
//           <li className="flex items-center justify-between text-gray-600">
//             <span>Admin added a new user</span>
//             <span className="text-sm text-gray-400">5 hours ago</span>
//           </li>
//           <li className="flex items-center justify-between text-gray-600">
//             <span>Project report submitted by Jane</span>
//             <span className="text-sm text-gray-400">1 day ago</span>
//           </li>
//         </ul>
//       </div>

//       {/* Quick Links */}
//       <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="p-6 bg-blue-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition">
//           <h3 className="text-lg font-bold">Manage Users</h3>
//           <p className="text-sm">View and update user details.</p>
//         </div>

//         <div className="p-6 bg-green-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-600 transition">
//           <h3 className="text-lg font-bold">Task Management</h3>
//           <p className="text-sm">Assign and track pending tasks.</p>
//         </div>

//         <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-yellow-600 transition">
//           <h3 className="text-lg font-bold">Generate Reports</h3>
//           <p className="text-sm">Access analytics and reports.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
