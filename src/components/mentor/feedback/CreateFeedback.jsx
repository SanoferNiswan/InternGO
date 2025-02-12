import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Rating from "react-rating-stars-component";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { predefinedKPIs } from "../../../utils/kpis";


const CreateFeedback = () => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const interaction = location.state?.interaction;

  const [selectedKPIs, setSelectedKPIs] = useState([]);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});

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

  const handleRatingChange = (kpi, value) => {
    setRatings({ ...ratings, [kpi]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (selectedKPIs.length < 5) {
      newErrors.kpis = "Please select at least 5 KPIs.";
    }

    selectedKPIs.forEach((kpi) => {
      if (!ratings[kpi]) {
        newErrors[kpi] = "Please provide a rating for this KPI.";
      }
    });

    if (!feedback.trim()) {
      newErrors.feedback = "Descriptive feedback cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const feedbackData = {
      interactionId: interaction?.id,
      internId: interaction?.internId,
      interviewerId: interaction?.interviewerId,
      ratings,
      descriptive_feedback: feedback,
    };

    try {
      await axios.post("/api/feedbacks/create", feedbackData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Feedback added succesfully")
      navigate("/dashboard/interactions", { replace: true });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error);
    }
  };

  if (!interaction || interaction.interactionStatus === "COMPLETED") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-red-500">
            You can't give feedback to this interaction
          </h2>
          <button
            onClick={() => navigate("/dashboard/interactions")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 border border-blue-300">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Feedback Form
        </h1>

        {/* Interaction Details */}
        <div className="mb-4 text-lg text-gray-700">
          <p>
            <strong>Interaction Name:</strong> {interaction?.name}
          </p>
          <p>
            <strong>Intern Name:</strong> {interaction?.assignedIntern}
          </p>
        </div>

        {/* KPI Selection */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select KPIs for Evaluation:</label>
          <div className="grid grid-cols-2 gap-2">
            {predefinedKPIs.map((kpi) => (
              <label key={kpi} className="flex items-center space-x-2 cursor-pointer">
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
        {errors.kpis && <p className="text-red-500 text-sm">{errors.kpis}</p>}

        {/* Ratings Section */}
        {selectedKPIs.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Provide Ratings:</label>
            {selectedKPIs.map((kpi) => (
              <div
                key={kpi}
                className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
              >
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
            {selectedKPIs.map((kpi) => errors[kpi] && (
              <p key={kpi} className="text-red-500 text-sm">{errors[kpi]}</p>
            ))}
          </div>
        )}

        {/* Descriptive Feedback */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Descriptive Feedback:</label>
          <textarea
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide detailed feedback..."
          ></textarea>
          {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback}</p>}
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleSubmit}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default CreateFeedback;