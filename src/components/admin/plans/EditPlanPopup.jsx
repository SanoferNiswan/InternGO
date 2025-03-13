import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPlanPopup = ({ planDetails, onClose, onUpdate, token }) => {
  const [updatedPlan, setUpdatedPlan] = useState({
    name: "",
    description: "",
    planDays: "",
    startDate: "",
    endDate: "",
  });

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (planDetails) {
      setUpdatedPlan({
        name: planDetails.name || "",
        description: planDetails.description || "",
        planDays: planDetails.planDays || "",
        startDate: planDetails.startDate || "",
        endDate: planDetails.endDate || "",
      });
    }
  }, [planDetails]);

  useEffect(() => {
    if (updatedPlan.startDate && updatedPlan.planDays) {
      const calculatedEndDate = new Date(updatedPlan.startDate);
      calculatedEndDate.setDate(
        calculatedEndDate.getDate() + parseInt(updatedPlan.planDays)
      );
      setUpdatedPlan((prev) => ({
        ...prev,
        endDate: calculatedEndDate.toISOString().split("T")[0],
      }));
    }
  }, [updatedPlan.startDate, updatedPlan.planDays]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "planDays") {
      newValue = parseInt(value, 10) || 0;
      if (newValue > 180) {
        toast.error("Plan days must not exceed 180.");
        return;
      }
    }

    setUpdatedPlan((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    const fetchedStartDate = new Date(planDetails.startDate);
    const selectedStartDate = new Date(newStartDate);

    if (selectedStartDate < fetchedStartDate) {
      toast.error("Start date cannot be earlier than the fetched start date.");
      return;
    }

    setUpdatedPlan((prev) => ({
      ...prev,
      startDate: newStartDate,
    }));
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = new Date(e.target.value);
    const minAllowedEndDate = new Date(updatedPlan.startDate);
    minAllowedEndDate.setDate(
      minAllowedEndDate.getDate() + parseInt(updatedPlan.planDays)
    );

    if (selectedEndDate >= minAllowedEndDate) {
      setUpdatedPlan((prev) => ({
        ...prev,
        endDate: e.target.value,
      }));
    } else {
      toast.error(
        `End date must be at least ${
          minAllowedEndDate.toISOString().split("T")[0]
        }`
      );
    }
  };

  const handleUpdate = async () => {
    setUpdate(true);

    try {
      if (parseInt(updatedPlan.planDays) > 180) {
        toast.error("Plan days must not exceed 180!");
        return;
      }

      const response = await axios.patch(
        `/api/plans/${planDetails?.id}/update`,
        { ...updatedPlan }
      );

      if (response.status === 200) {
        toast.success("Plan updated successfully!");
        onUpdate(updatedPlan);
        window.location.reload();
        onClose();
        onUpdate(updatedPlan);
      } else {
        toast.error("Failed to update plan.");
      }
    } catch (error) {
      toast.error(JSON.stringify(error.response?.data?.message));
      console.error("Error updating plan:", error);
    } finally {
      setUpdate(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Plan</h2>

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

        <div className="relative mb-4">
          <input
            type="number"
            name="planDays"
            value={updatedPlan.planDays}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            onChange={handleInputChange}
            placeholder=" "
            min="1"
            max="180"
          />
          <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
            Plan Days
          </label>
        </div>

        <div className="relative mb-4">
          <input
            type="date"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={
              updatedPlan.startDate ? updatedPlan.startDate.split("T")[0] : ""
            }
            onChange={handleStartDateChange}
            required
          />

          <label className="absolute text-md text-gray-500 top-2 bg-white px-2 ml-2 scale-75 -translate-y-4 peer-focus:text-blue-600">
            Start Date
          </label>
        </div>

        <div className="relative mb-4">
          <input
            type="date"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={updatedPlan.endDate}
            onChange={handleEndDateChange}
            required
          />
          <label className="absolute text-md text-gray-500 top-2 bg-white px-2 ml-2 scale-75 -translate-y-4 peer-focus:text-blue-600">
            End Date
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded ${
              update ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            onClick={handleUpdate}
            disabled={update}
          >
            {update ? "Updating" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlanPopup;
