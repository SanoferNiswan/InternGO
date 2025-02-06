import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditPlanPopup from "./EditPlanPopup";
import UserList from "./UserList";
import MilestoneList from "./MilestoneList";
import AddMilestoneForm from "./AddMilestoneForm";

const Milestones = () => {
  const navigate = useNavigate(); 
  const { planId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [planDetails, setPlanDetails] = useState({
    name: "",
    planDays: null,
    description: "",
  });
  const [listOfMilestone, setListOfMilestone] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  // Fetch plan details
  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`/api/plans/${planId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlanDetails(response.data.data);
        setListOfMilestone(response.data.data.milestones);
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };

    fetchPlanDetails();
  }, [planId, token]);

  const deletePlan = async () => {
    if (!window.confirm(`Are you sure you want to delete this plan ${planId}`))
      return;

    try {
      await axios.delete(`/api/plans/delete/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Plan deleted successfully");
      navigate("/dashboard/plans");
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  if (!planDetails || !planDetails.milestones) {
    return <div>Loading...</div>;
  }

  return (
    <div className="shadow-md p-4 rounded-lg bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-lg font-semibold">
          Plan Name: {planDetails.name}
        </div>
        <div className="text-gray-600">{planDetails.planDays} Days</div>
      </div>

      <p className="text-gray-700 p-4">{planDetails.description}</p>
      <p className="text-gray-700 p-4">
        Number of users in current plan: {planDetails.users.length}
      </p>

      <div className="flex justify-end space-x-4">
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => setIsEditing(true)}
        >
          <FaEdit className="mr-2" /> Edit
        </button>
        <button
          className="text-red-600 hover:text-red-800 flex items-center"
          onClick={() => deletePlan()}
        >
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>

      <div className="flex gap-2">
        <div className="w-2/3">
          <MilestoneList
            listOfMilestone={listOfMilestone}
            setListOfMilestone={setListOfMilestone}
            planId={planId}
            token={token}
          />

          {showMilestoneForm && (
            <AddMilestoneForm
              setShowMilestoneForm={setShowMilestoneForm}
              setListOfMilestone={setListOfMilestone}
              planId={planId}
              token={token}
            />
          )}

          <div className="text-center mt-4">
            <button
              className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
              onClick={() => setShowMilestoneForm(true)}
            >
              + Add Milestone
            </button>
          </div>
        </div>

        <div className="w-1/3">
          <UserList planId={planId} />
        </div>
      </div>

      {isEditing && (
        <EditPlanPopup
          planDetails={planDetails}
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedPlan) => setPlanDetails(updatedPlan)}
          token={token}
        />
      )}
    </div>
  );
};

export default Milestones;
