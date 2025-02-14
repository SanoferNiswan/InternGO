import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditPlanPopup from "./EditPlanPopup";
import UserList from "./UserList";
import MilestoneList from "./MilestoneList";
import AddMilestoneForm from "./AddMilestoneForm";
import { toast } from "react-toastify";
import Loader from "../../Loader";

const Milestones = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [showUserList, setShowUserList] = useState(false);
  const [planDetails, setPlanDetails] = useState({
    name: "",
    planDays: null,
    description: "",
  });
  const [listOfMilestone, setListOfMilestone] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlanDetails();
  }, [planId, token]);

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
      toast.error(
        "Error fetching plan details:",
        error.response.data.statusCode
      );
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async () => {
    try {
      await axios.delete(`/api/plans/delete/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Plan deleted successfully");
      navigate("/admin/plans");
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md">
        ❌ No plan found
      </div>
    );
  }

  return (
    <div className="shadow-md p-4 rounded-lg bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-lg font-semibold">
          Plan Name: {planDetails?.name}
        </div>
        <div className="text-gray-600">{planDetails?.planDays} Days</div>
      </div>

      <p className="text-gray-700 p-4">{planDetails?.description}</p>
      <p className="text-gray-700 p-4">
        Number of users in current plan: {planDetails?.users.length}
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

      <div className="text-center mt-4">
        <button
          className={`text-sm px-3 py-1 rounded ${
            showUserList
              ? "bg-red-600 hover:bg-red-800 text-white"
              : "bg-blue-600 hover:bg-blue-800 text-white"
          }`}
          onClick={() => setShowUserList(!showUserList)}
        >
          {showUserList ? "Hide Users List" : "Add Users to Plan"}
        </button>
      </div>

      <div className={`flex flex-col md:flex-row gap-4 mt-4`}>
        <div className={`${showUserList ? "md:w-2/3 w-full" : "w-full"}`}>
          <MilestoneList
            listOfMilestone={listOfMilestone}
            setListOfMilestone={setListOfMilestone}
            planId={planId}
            planDays={planDetails.planDays}
          />

          {showMilestoneForm && (
            <AddMilestoneForm
              setShowMilestoneForm={setShowMilestoneForm}
              refreshData={fetchPlanDetails}
              planId={planId}
              currentMilestones={listOfMilestone}
              planDays={planDetails.planDays}
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

        {showUserList && (
          <div className={`w-full ${showUserList ? "md:w-1/3" : ""}`}>
            <UserList planId={planId} />
          </div>
        )} 
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
