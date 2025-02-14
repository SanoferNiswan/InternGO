import React, { useState, useEffect } from "react";
import { connectSocket } from "../services/socketService";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import Loader from "./Loader";

const Announcement = () => {
  const { userId, token } = useSelector((state) => state.auth);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/notifications/get/announcements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.statusCode === 200) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);

    socket.on("announcement", (newAnnouncement) => {
      setAnnouncements((prev) => [
        newAnnouncement.createdNotification,
        ...prev,
      ]);
    });

    return () => {
      socket.off("announcement");
      console.log("announcement off");
    };
  }, [userId]);

  return (
    <div className="h-auto max-h-64 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
      {loading ? (
        <p className="text-gray-500 text-center py-4 italic h-full items-center justify-center flex bg-gray-100 rounded-md ">
          loading...
        </p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-500 text-center py-4 italic h-full items-center justify-center flex bg-gray-100 rounded-md ">
          🚀 No announcements at the moment... Stay tuned!
        </p>
      ) : (
        <ul>
          {announcements.map((announcement) => (
            <li
              key={announcement.id}
              className="mb-2 p-2 border-b border-gray-200"
            >
              {announcement.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcement;
