import React, { useState } from "react";
import Rating from "react-rating-stars-component";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { predefinedKPIs } from "../../../utils/kpis";
 

const EditFeedbackModal = ({ isOpen, onClose, feedback, refreshData }) => {
  const { token } = useSelector((state) => state.auth);

  if (!isOpen || !feedback) return null;

  const [ratings, setRatings] = useState(feedback.ratings || {});
  const [selectedKPIs, setSelectedKPIs] = useState(Object.keys(ratings));
  const [descriptiveFeedback, setDescriptiveFeedback] = useState(feedback.descriptive_feedback || "");

  // Handle KPI selection
  const handleKPISelection = (kpi) => {
    if (selectedKPIs.includes(kpi)) {
      setSelectedKPIs(selectedKPIs.filter((item) => item !== kpi));
      const updatedRatings = { ...ratings };
      delete updatedRatings[kpi];
      setRatings(updatedRatings);
    } else {
      setSelectedKPIs([...selectedKPIs, kpi]);
    }
  };

  // Handle Rating change
  const handleRatingChange = (kpi, value) => {
    setRatings({ ...ratings, [kpi]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!descriptiveFeedback.trim()) {
      toast.error("Descriptive feedback cannot be empty.");
      return;
    }

    const unratedKPIs = selectedKPIs.filter((kpi) => !ratings[kpi]);
    if (unratedKPIs.length > 0) {
      toast.error(`Please provide ratings for: ${unratedKPIs.join(", ")}`);
      return;
    }

    const updatedFeedback = {
      ratings,
      descriptive_feedback: descriptiveFeedback,
    };

    try {
      await axios.put(`/api/feedbacks/${feedback.id}/update`, updatedFeedback, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Feedback updated successfully!");
      refreshData();
      onClose();
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error("Failed to update feedback.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] max-h-[90vh] overflow-y-auto max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">Edit Feedback</h2>

          {/* KPI Selection */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Select KPIs for Evaluation:</label>
            <div className="grid grid-cols-2 gap-2">
              {predefinedKPIs.map((kpi) => (
                <label key={kpi} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedKPIs.includes(kpi)}
                    onChange={() => handleKPISelection(kpi)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">{kpi}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Selection */}
          {selectedKPIs.length > 0 && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Provide Ratings:</label>
              {selectedKPIs.map((kpi) => (
                <div key={kpi} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                  <span className="text-gray-800">{kpi}</span>
                  <Rating
                    count={5}
                    value={ratings[kpi] || 0}
                    onChange={(value) => handleRatingChange(kpi, value)}
                    size={24}
                    activeColor="#ffd700"
                    isHalf={true}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Descriptive Feedback */}
          <label className="block font-semibold mb-2">Descriptive Feedback:</label>
          <textarea
            rows="4"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={descriptiveFeedback}
            onChange={(e) => setDescriptiveFeedback(e.target.value)}
            placeholder="Update detailed feedback..."
          ></textarea>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg" onClick={onClose}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditFeedbackModal;
