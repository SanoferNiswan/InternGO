import React, { useEffect, useState } from "react";
import Announcement from "../../components/Announcement";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const InternDashboard = () => {
  const { user, token, userId, profilePhoto, name } = useSelector(
    (state) => state.auth
  );

  const [loading,setLoading] = useState(false);

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
      console.log(response);
      
    } catch (error) {
      toast.error(error);
    }finally{
      setLoading(false);
    }
  };

  if(loading){
    return <Loader />
  }

  return (
    <div className="p-2">
      <div className="bg-blue-500 text-white p-6 rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-md mb-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={name}
            className="w-28 h-28 rounded-full aspect-square object-cover"
          />
          
        ) : (
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-500 aspect-square object-cover">
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

      <div className="mt-8 bg-white p-6 shadow-md rounded-lg max-h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          📢 Announcements
        </h2>
        <Announcement />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <h3 className="text-gray-500 mb-2">Current Zone</h3>
          <p
            className={`text-lg font-bold ${
              user?.zone === "GREEN ZONE"
                ? "text-green-500"
                : user?.zone === "RED ZONE"
                ? "text-red-500"
                : user?.zone === "YELLOW ZONE"
                ? "text-blue-500"
                : "text-red-400"
            }`}
          >
            {user?.zone || "Not updated"}
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <h3 className="text-gray-500 mb-3">Training Phase</h3>
          <p className="text-lg font-bold text-blue-500">
            {planDetails?.name || "No plans assigned"}
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
          <h3 className="text-gray-500 mb-3">Current Mentor</h3>
          <p className="text-lg font-bold text-yellow-500">
            {planDetails?.mentorName || "No mentors assigned"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default InternDashboard;
