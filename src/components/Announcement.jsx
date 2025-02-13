import React, { useState, useEffect } from "react";
import { connectSocket } from "../services/socketService";
import { useSelector } from "react-redux";
import axios from "../api/axios";

const Announcement = () => {
  const { userId , token } = useSelector((state) => state.auth);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("/api/notifications/get/announcements",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if (response.data?.statusCode === 200) {
        setAnnouncements(response.data.data); 
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };


  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);

    socket.on("announcement", (newAnnouncement) => {
      
      setAnnouncements((prev) => [newAnnouncement.createdNotification, ...prev]);
    });

    return () => { 
      socket.off("announcement");
      console.log("announcement off");
      
    };
  }, [userId]);

  return (
    <div className="max-h-80 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
      {announcements.length === 0 ? (
        <p>No announcements..!</p>
      ) : (
        <ul>
          {announcements.map((announcement) => (
            <li key={announcement.id} className="mb-2 p-2 border-b border-gray-200">
              {announcement.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcement;
