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
  const { user, token, userId, profilePhoto, name } = useSelector(
    (state) => state.auth
  );

  const [planDetails, setPlanDetails] = useState(null);

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2">
      <div className="bg-blue-500 text-white p-6 rounded-lg flex  gap-6 shadow-md mb-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Admin"
            className="w-28 h-28 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-lg font-bold text-blue-500">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Welcome, {name}!</h2>
          <p className="text-md text-gray-200">
            Update your daily tasks, track your progress, and stay engaged with
            the latest updates. Receive real-time notifications, important
            announcements, and insights to stay ahead and maximize productivity.
          </p>
        </div>
      </div>

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
