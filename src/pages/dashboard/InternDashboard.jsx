import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaTasks,
  FaCheckCircle,
  FaBullhorn,
  FaClock,
} from "react-icons/fa";
import Announcement from "../../components/Announcement";
import { useSelector } from "react-redux";
import axios from "../../api/axios";

const InternDashboard = () => {
  const { user, token, userId } = useSelector((state) => state.auth);
  const [planDetails, setPlanDetails] = useState(null);
  console.log("zone:", user.zone);

  useEffect(() => {
    fetchPlanDetails();
  }, [token]);

  const fetchPlanDetails = async () => {
    try {
      const response = await axios.get(`/api/users/training/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlanDetails(response.data.data);
      console.log("plan details:", response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2">
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

      <div className="mt-8 bg-white p-6 shadow-md rounded-lg max-h-full">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          📢 Announcements
        </h2>
        <Announcement />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-gray-500">Status</h3>
          <p
            className={`text-lg font-bold ${
              user?.zone === "GREEN ZONE"
                ? "text-green-500"
                : user?.zone === "RED ZONE"
                ? "text-red-500"
                : user?.zone === "YELLOW ZONE"
                ? "text-yellow-500"
                : "text-gray-500"
            }`}
          >
            {user?.zone || "Not updated"}
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-gray-500">Training Phase</h3>
          <p className="text-lg font-bold text-blue-500">
            {planDetails?.name || "No plans available"}
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-gray-500">Current Mentor</h3>
          <p className="text-lg font-bold text-blue-500">
            {planDetails?.mentorName || "No mentors assigned"}
          </p>
        </div>
      </div>

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
