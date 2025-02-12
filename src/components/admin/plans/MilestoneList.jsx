import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import ObjectiveList from "./ObjectiveList";
import axios from "../../../api/axios";
import { useSelector, useDispatch } from "react-redux"; 
import { fetchMentors } from "../../../redux/slices/dataSlice";
import { toast } from "react-toastify";

const MilestoneList = ({ listOfMilestone, setListOfMilestone, planId,planDays }) => {
  const [showObjectiveForm, setShowObjectiveForm] = useState(null);
  const dispatch = useDispatch();
  const { mentors } = useSelector((state) => state.data);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (mentors.length === 0) {
      dispatch(fetchMentors());
    }
  }, [token, dispatch]);

  const totalMilestoneDays = listOfMilestone.reduce(
    (sum, milestone) => sum + milestone.milestoneDays,
    0
  );

  const handleMilestoneChange = (e, milestoneId, field) => {
    const { value } = e.target;
    setListOfMilestone((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, [field]: value }
          : milestone
      )
    );
  };

  const handleUpdateMilestone = async (milestone, planId) => {
    try {
      if (totalMilestoneDays + parseInt(milestone.milestoneDays) > planDays) {
            toast.error(`Total milestone days cannot exceed ${planDays}!`);
            return;
          }

      await axios.patch(
        `/api/plans/${planId}/update/milestone`,
        {
          milestoneId: milestone.id,
          milestoneData: {
            name: milestone.name,
            mentorName: milestone.mentorName,
            milestoneDays: parseInt(milestone.milestoneDays),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Milestone updated");
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      await axios.delete(`/api/plans/delete/milestone/${milestoneId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setListOfMilestone((prevMilestones) =>
        prevMilestones.filter((milestone) => milestone.id !== milestoneId)
      );

      toast.success(`Milestone ${milestoneId} deleted successfully`);
    } catch (error) {
      toast.error("Error deleting milestone:", error);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {(listOfMilestone || []).map((milestone, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-100">
          <div className="bg-white p-2 shadow-lg rounded-lg">
            <div>
              <p className="p-2 font-bold">Milestone {milestone.id}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="relative">
                <input
                  type="text"
                  value={milestone.name}
                  onChange={(e) =>
                    handleMilestoneChange(e, milestone.id, "name")
                  }
                  onBlur={() => handleUpdateMilestone(milestone, planId)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                />
                <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 z-5 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600">
                  Name
                </label>
              </div>

              <div className="relative">
                <select
                  value={milestone.mentorName}
                  onChange={(e) =>
                    handleMilestoneChange(e, milestone.id, "mentorName")
                  }
                  onBlur={() => handleUpdateMilestone(milestone, planId)}
                  className="block px-2.5 pb-2.5 pt-4 w-full w-72 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer appearance-none"
                >
                  <option value="" disabled hidden>
                    Select a mentor
                  </option>
                  {mentors.map((mentor) => (
                    <option key={mentor} value={mentor}>
                      {mentor}
                    </option>
                  ))}
                </select>
                <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 z-5 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600">
                  Mentor
                </label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={milestone.milestoneDays}
                  onChange={(e) =>
                    handleMilestoneChange(e, milestone.id, "milestoneDays")
                  }
                  onBlur={() => handleUpdateMilestone(milestone, planId)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                />
                <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 z-5 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600">
                  Days
                </label>
              </div>

              <button
                className="text-red-600 hover:text-red-800 pr-8 ml-2"
                onClick={() => handleDeleteMilestone(milestone.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <ObjectiveList
            milestone={milestone}
            setListOfMilestone={setListOfMilestone}
            planId={planId}
            showObjectiveForm={showObjectiveForm}
            setShowObjectiveForm={setShowObjectiveForm}
          />
        </div>
      ))}
    </div>
  );
};

export default MilestoneList;
