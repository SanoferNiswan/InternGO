import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import Announcement from "../../components/Announcement";
import { toast } from "react-toastify";
import { FaBook, FaClock, FaTasks } from "react-icons/fa";
import { decodeToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const MentorDashboard = () => {
  const { token, profilePhoto, name } = useSelector(
    (state) => state.auth
  );

  const [forbidden,setForbidden] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const {userId} = decodeToken(token);
  const [interactionCount, setInteractionCount] = useState({});

  useEffect(() => {
    fetchCount();
  }, [userId]);

  const fetchCount = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/users/${userId}/interactionCount`
      );
      setInteractionCount(response.data.data);
    } catch (error) {
      if(error.response?.data?.statusCode==403) setForbidden(true);
      toast.error(JSON.stringify(error.response?.data?.message));
    }finally{
      setLoading(false);
    }
  };

  if(loading) return <Loader />

  if(forbidden) navigate("/403");

  return (
    <div className="p-2">
      <div className="bg-blue-500 text-white p-6 rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-md mb-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Admin"
            className="w-28 h-28 rounded-full aspect-square object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center font-bold text-blue-500 aspect-square object-cover text-4xl">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Welcome, {name}!</h2>
          <p className="text-sm sm:text-md text-gray-200">
            Stay on top of interactions and real time feedback, track progress
            effortlessly, and stay informed with real-time updates. Get
            important notifications, key insights, and announcements to enhance
            productivity and stay ahead.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 shadow-md rounded-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          📢 Announcements
        </h2>
        <Announcement />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <FaTasks className="text-blue-500 text-2xl" />
          <div>
            <p className="text-gray-500">Interactions Completed</p>
            <h2 className="text-2xl font-bold text-center">
              {interactionCount?.interactionTaken}
            </h2>
          </div>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <FaClock className="text-yellow-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-center">Pending Interactions</p>
            <h2 className="text-2xl font-bold text-center">
              {interactionCount?.interactionPending}
            </h2>
          </div>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg flex items-center gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <FaBook className="text-purple-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-center">Pending feedback</p>
            <h2 className="text-2xl font-bold text-center">
              {interactionCount?.interactionFeedbackPending}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
