import React, { useState } from "react";
import { FaBell, FaTrash, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
 
const NotificationBell = ({ notifications, setNotifications }) => {
  const { token, userId } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const markAsRead = async () => {
    if (selectedNotifications.length === 0) {
      toast.warning("Select at least one notification!", { autoClose: 2000 });
      return;
    }
    try {
      await axios.patch(
        `/api/notifications/markAsRead`,
        { notificationIds: selectedNotifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          selectedNotifications.includes(notif.id)
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setSelectedNotifications([]);
      toast.success("Selected notifications marked as read", {
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `/api/notifications/${userId}/markAllAsRead`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      toast.success("All notifications marked as read", { autoClose: 2000 });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Delete selected notifications
  const deleteNotifications = async () => {
    if (selectedNotifications.length === 0) {
      toast.warning("Select at least one notification!", { autoClose: 2000 });
      return;
    }
    try {
      await axios.delete(`/api/notifications/delete`, {
        data: { notificationIds: selectedNotifications },
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.filter((notif) => !selectedNotifications.includes(notif.id))
      );
      setSelectedNotifications([]);
      toast.success("Selected notifications deleted", { autoClose: 2000 });
    } catch (error) {
      console.error("Error deleting notifications:", error);
      toast.error("Failed to delete notifications");
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      await axios.delete(`/api/notifications/${userId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      toast.success("All notifications deleted", { autoClose: 2000 });
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast.error("Failed to delete all notifications");
    }
  };

  // Select/Deselect a notification
  const toggleSelection = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((notifId) => notifId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-gray-700 hover:text-blue-600 focus:outline-none relative"
      >
        <FaBell className="text-2xl" />
        {notifications.filter((notif) => !notif.isRead).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {notifications.filter((notif) => !notif.isRead).length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 h-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 flex justify-between items-center border-b border-gray-300">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <div className="flex space-x-3">
              <button
                onClick={markAllAsRead}
                className="text-green-600 text-xs hover:text-green-800 flex items-center space-x-1"
              >
                <FaCheck /> <span>Mark All as read</span>
              </button>
              <button
                onClick={deleteAllNotifications}
                className="text-red-600 text-xs hover:text-red-800 flex items-center space-x-1"
              >
                <FaTrash /> <span>Delete All</span>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-72 px-4 py-2">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">No new notifications</p>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`py-3 px-4 border-b border-gray-200 flex justify-between items-center ${
                      notification.isRead
                        ? "text-gray-400"
                        : "text-gray-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(
                          notification.id
                        )}
                        onChange={() => toggleSelection(notification.id)}
                        className="cursor-pointer"
                      />
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedNotifications.length > 0 && (
            <div className="p-2 flex justify-between border-t border-gray-300 mb-2">
              <button
                onClick={markAsRead}
                className="w-full text-green-600 text-xs hover:text-green-800 flex items-center justify-center space-x-1 py-2 border rounded-md hover:bg-green-100"
              >
                <FaCheck /> <span>Mark Selected as Read</span>
              </button>
              <button
                onClick={deleteNotifications}
                className="w-full text-red-600 text-xs hover:text-red-800 flex items-center justify-center space-x-1 py-2 border rounded-md hover:bg-red-100 ml-2"
              >
                <FaTrash /> <span>Delete Selected</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

