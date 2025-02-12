import React, { useState, useEffect } from "react";
import { connectSocket } from "../services/socketService";
import { useSelector } from "react-redux";

const Announcement = () => {
  const { userId } = useSelector((state) => state.auth);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);

    socket.on("announcement", (newAnnouncements) => {
      console.log("New announcement received:", newAnnouncements);
      setAnnouncements(newAnnouncements.createdNotification.message); 
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  if(announcements.length===0){
    return <p>No announcements..!</p>
  }

  return (
    <div>
      <p>{announcements}</p>
    </div>
  );
};

export default Announcement;
