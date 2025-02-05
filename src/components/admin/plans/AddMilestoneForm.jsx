import React, { useState } from "react";
import axios from "../../../api/axios";

const AddMilestoneForm = ({
  setShowMilestoneForm,
  setListOfMilestone,
  planId,
  token,
}) => {
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    mentorName: "",
    milestoneDays: null,
  });

  const addMilestone = async () => {
    if (
      !newMilestone.name ||
      !newMilestone.mentorName ||
      newMilestone.milestoneDays < 0
    ) {
      alert("Please fill all fields and ensure days are greater than 0.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/plans/${planId}/create/milestone`,
        newMilestone,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowMilestoneForm(false);
      setListOfMilestone((prev) => [...(prev || []), response.data.data]);

      // Reset form
      setNewMilestone({ name: "", mentorName: "", milestoneDays: null });
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-100">
      <div className="bg-white p-2 shadow-lg rounded-lg">
        <h1 className="mb-3 ml-3 font-bold">Add Milestone</h1>
        <div className="flex justify-between items-center border-b pb-2">
          <div className="relative">
            <input
              type="text"
              value={newMilestone.name} 
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              value={newMilestone.mentorName}
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  mentorName: e.target.value,
                }))
              }
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Mentor Name
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              value={newMilestone.milestoneDays}
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  milestoneDays: parseInt(e.target.value),
                }))
              }
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Days
            </label>
          </div>

          <div className="flex justify-around w-1/6">
            <button
              onClick={addMilestone}
              className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
            >
              Save
            </button>
            <button
              onClick={() => setShowMilestoneForm(false)}
              className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMilestoneForm;
