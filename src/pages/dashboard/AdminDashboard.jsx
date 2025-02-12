import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaClipboardList,
  FaTasks,
  FaChartBar,
  FaProjectDiagram,
  FaFileAlt,
  FaBullhorn,
  FaGift,
} from "react-icons/fa";
import Announcement from "../../components/Announcement";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";

const AdminDashboard = () => {

  const [statusCount,setStatusCount] = useState({});
  const [loading,setLoading]=useState(true);
  const {token} = useSelector((state)=>state.auth);

  useEffect(()=>{
    fetchStatusCount();
  },[]);

  const fetchStatusCount = async () => {
    try{
      const response = await axios.get(`/api/users/count/status`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setStatusCount(response.data.data);
      console.log(response.data.data);
      
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  if(loading){
    return <Loader />
  }


  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaUsers className="text-blue-500 text-4xl" />
          <div>
            <p className="text-gray-500">Total Interns</p>
            <h2 className="text-2xl font-bold text-center">{statusCount?.totalCount}</h2>
          </div>
        </div>

        {/* Active Interns */}
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaClipboardList className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500">Active Interns</p>
            <h2 className="text-2xl font-bold text-center">{statusCount?.activeStatus}</h2>
          </div>
        </div>

        {/* Total Projects */}
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaProjectDiagram className="text-purple-500 text-4xl" />
          <div>
            <p className="text-gray-500">Non Active Interns</p>
            <h2 className="text-2xl font-bold text-center">{statusCount.notActiveStatus}</h2>
          </div>
        </div>
        

        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4">
          <FaGift className="text-yellow-500 text-4xl" />
          <div>
            <p className="text-gray-500">Deployed Interns</p>
            <h2 className="text-2xl font-bold text-center">{statusCount.deployedCount}</h2>
          </div>
        </div>

      </div>

      <div className="mt-8 bg-white p-6 shadow-md rounded-lg max-h-full">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
        📢 Announcements
        </h2>
        <Announcement />
      </div>

      {/* User Management Table */}
      <div className="mt-8 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          User Management
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                User
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Role
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">John Doe</td>
              <td className="border border-gray-300 px-4 py-2">Admin</td>
              <td className="border border-gray-300 px-4 py-2 text-green-500">
                Active
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">
                  Remove
                </button>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
              <td className="border border-gray-300 px-4 py-2">Intern</td>
              <td className="border border-gray-300 px-4 py-2 text-yellow-500">
                Pending
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
