import React, { useState } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";

const CreateAnnouncement = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
 
    try {
      const response = await axios.post(
        "/api/notifications/createAnnouncement",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Announcement created successfully!");
      setMessage(""); 
    } catch (err) {
      setError("Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📢 Create Announcement
      </h2>

      {success && (
        <p className="text-green-600 bg-green-100 border border-green-400 p-2 rounded-md mb-3">
         {success}
        </p>
      )}
      {error && (
        <p className="text-red-600 bg-red-100 border border-red-400 p-2 rounded-md mb-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your announcement here..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-500"
          rows="4"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Create Announcement"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
