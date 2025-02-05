import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { parsePath } from "react-router-dom";

const EditPlanPopup = ({ planDetails, onClose, onUpdate, token }) => {
  const [updatedPlan, setUpdatedPlan] = useState({
    name: "",
    description: "",
    planDays: "", 
  });

  useEffect(() => {
    if (planDetails) {
      setUpdatedPlan({
        name: planDetails.name || "",
        description: planDetails.description || "",
        planDays: planDetails.planDays || "",
      });
    }
  }, [planDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPlan((prev) => ({ ...prev, [name]:name==="planDays"?parseInt(value,10)||0: value }));
  };

  const handleUpdate = async () => {
    try {
      console.log(planDetails);
      
      const response = await axios.patch(
        `/api/plans/${planDetails?.id}/update`,
        { ...updatedPlan },
        { 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Plan updated successfully!");
        onUpdate(updatedPlan);
        window.location.reload();
        onClose();
      } else {
        alert("Failed to update plan.");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Plan</h2>

        {/* Name Input */}
        <div className="relative mb-4">
          <input
            type="text"
            name="name"
            value={updatedPlan.name}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            onChange={handleInputChange}
            placeholder=" "
          />
          <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
            Plan Name
          </label>
        </div>

        {/* Description Input */}
        <div className="relative mb-4">
          <textarea
            type="textArea"
            name="description"
            value={updatedPlan.description}
            className="block px-2.5 pb-2.5 pt-4 h-28 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            onChange={handleInputChange}
            placeholder=" "
          ></textarea>
          <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
            Description
          </label>
        </div>

        {/* Plan Days Input */}
        <div className="relative mb-4">
          <input
            type="number"
            name="planDays"
            value={updatedPlan.planDays}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            onChange={handleInputChange}
            placeholder=" "
          />
          <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
            Plan Days
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlanPopup;
