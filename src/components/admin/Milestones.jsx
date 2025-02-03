import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditPlanPopup from "./EditPlanPopup";

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
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    mentorName: "",
    milestoneDays: null,
  });
  const [newObjective, setNewObjective] = useState({
    name: "",
    description: "",
    objectiveDays: null,
    noOfInteractions: null,
    roadmapType: "DEFAULT",
    milestoneId: null,
  });

  const [showObjectiveForm, setShowObjectiveForm] = useState(null);
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
        console.log(response.data.data);

        setPlanDetails(response.data.data);
        setListOfMilestone(response.data.data.milestones);
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };

    fetchPlanDetails();
  }, [planId, token]);

  // Handle adding a new milestone
  const addMilestone = async () => {
    if (
      !newMilestone.name ||
      !newMilestone.mentorName ||
      newMilestone.milestoneDays < 0
    ) {
      alert("Please fill all fields and ensure days are greater than 0.");
      return;
    }
    console.log(newMilestone);

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
      console.log("response:", response.data.data);
      const data = response.data.data;
      console.log(JSON.stringify(data));
      setListOfMilestone((prev) => [...(prev || []), response.data.data]);
      alert(JSON.stringify(newMilestone));

      // Reset form
      setNewMilestone({ name: "", mentorName: "", milestoneDays: null });
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  // Handle adding a new objective
  const addObjective = async (milestoneId) => {
    const objectiveData = {
      ...newObjective,
      objectiveDays: parseInt(newObjective.objectiveDays) || 0,
      noOfInteractions: parseInt(newObjective.noOfInteractions) || 0,
      milestoneId: milestoneId,
    };

    if (
      !newObjective.name ||
      !newObjective.description ||
      newObjective.objectiveDays <= 0 ||
      newObjective.noOfInteractions <= 0
    ) {
      alert(
        "Please fill all fields and ensure days and interactions are greater than 0."
      );
      return;
    }

    // Update UI with the new objective
    const newMilestone_data = listOfMilestone.map((milestone) => {
      if (milestoneId === milestone.id) {
        return {
          ...milestone,
          objectives: [...milestone.objectives, objectiveData],
        };
      }
      return milestone;
    });
    setShowObjectiveForm(null);
    setListOfMilestone(newMilestone_data);

    try {
      const response = await axios.post(
        `/api/plans/${planId}/create/objective`,
        objectiveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and hide the input row
      setNewObjective({
        name: "",
        description: "",
        objectiveDays: null,
        noOfInteractions: null,
        roadmapType: "DEFAULT",
        milestoneId: null,
      });
    } catch (error) {
      console.error("Error adding objective:", error);
    }
  };

  const handleMilestoneChange = (e, milestoneId, field) => {
    const { value } = e.target;

    // Update the milestone in state
    setListOfMilestone((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, [field]: value }
          : milestone
      )
    );
  };

  const handleUpdateMilestone = async (milestone,planId) => {
    console.log("milestone updation called :", milestone);
    console.log(
      `milestone id ${milestone.id} name : ${milestone.name} mentor : ${milestone.mentorName} days:${milestone.milestoneDays}`
    );

    console.log("plan Id : ",planId);

    try {
      
      const response = await axios.patch(
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

      console.log("patched");
      

      console.log("Milestone updated:", response.data);
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this milestone? ${milestoneId} from plan ${planId}`
      )
    )
      return;

    try {
      await axios.delete(`/api/plans/delete/milestone/${milestoneId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setListOfMilestone((prevMilestones) =>
        prevMilestones.filter((milestone) => milestone.id !== milestoneId)
      );

      alert(`Milestone ${milestoneId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

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

  const handleObjectiveChange = (e, milestoneId, objectiveId, field) => {
    let { value } = e.target;

    // Convert numeric fields to numbers
    if (field === "objectiveDays" || field === "noOfInteractions") {
      value = Number(value);
    }

    // Update state immediately
    setListOfMilestone((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.id === milestoneId
          ? {
              ...milestone,
              objectives: milestone.objectives.map((objective) =>
                objective.id === objectiveId
                  ? { ...objective, [field]: value }
                  : objective
              ),
            }
          : milestone
      )
    );
  };

  const handleUpdateObjective = async (milestoneId, objective) => {
    try {
      const response = await axios.patch(
        `/api/plans/${planId}/update/objective`, // Ensure the correct endpoint
        {
          objectiveId: objective.id, // ✅ Required field
          objectiveData: {
            name: objective.name, // ✅ Inside objectiveData
            description: objective.description, // ✅ Ensure description is included
            objectiveDays: objective.objectiveDays,
            noOfInteractions: objective.noOfInteractions,
            mentorName: objective.mentorName,
            roadmapType: objective.roadmapType,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Objective updated:", response.data);
    } catch (error) {
      console.error("Error updating objective:", error.response?.data || error);
    }
  };

  const handleDeleteObjective = async (milestoneId, objectiveId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this objective?${objectiveId}`
      )
    )
      return;

    try {
      await axios.delete(`/api/plans/delete/objective/${objectiveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove objective from state
      setListOfMilestone((prevMilestones) =>
        prevMilestones.map((milestone) =>
          milestone.id === milestoneId
            ? {
                ...milestone,
                objectives: milestone.objectives.filter(
                  (objective) => objective.id !== objectiveId
                ),
              }
            : milestone
        )
      );

      alert(`Objective ${objectiveId} deleted`);
    } catch (error) {
      console.error("Error deleting objective:", error);
    }
  };

  // Show loading state while planDetails is null
  if (!planDetails || !planDetails.milestones) {
    return <div>Loading...</div>;
  }

  return (
    <div className="shadow-md p-4 rounded-lg bg-white">
      {/* Plan Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-lg font-semibold">
          Plan Name: {planDetails.name}
        </div>
        <div className="text-gray-600">{planDetails.planDays} Days</div>
      </div>

      {/* Description */}
      <p className="text-gray-700 p-4">{planDetails.description}</p>

      {/* Actions */}
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

      {/* Milestones */}
      <div className="mt-6 space-y-4">
        {(listOfMilestone || []).map((milestone, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-100">
            {/* Milestone Header */}
            <div className="bg-white p-2 shadow-lg rounded-lg">
              <div>
                <p className="p-2 font-bold">Milestone {milestone.id}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) =>
                      handleMilestoneChange(e, milestone.id, "name")
                    }
                    onBlur={() => handleUpdateMilestone(milestone,planId)}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  />
                  <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 z-5 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600">
                    Name
                  </label>
                </div>

                {/* Mentor Name */}
                <div className="relative">
                  <input
                    type="text"
                    value={milestone.mentorName}
                    onChange={(e) =>
                      handleMilestoneChange(e, milestone.id, "mentorName")
                    }
                    onBlur={() => handleUpdateMilestone(milestone,planId)}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  />
                  <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 z-5 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600">
                    Mentor Name
                  </label>
                </div>

                {/* Number of Days */}
                <div className="relative">
                  <input
                    type="number"
                    value={milestone.milestoneDays}
                    onChange={(e) =>
                      handleMilestoneChange(e, milestone.id, "milestoneDays")
                    }
                    onBlur={() => handleUpdateMilestone(milestone,planId)}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  />
                  <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 z-5 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600">
                    Days
                  </label>
                </div>

                {/* Delete Button */}
                <button
                  className="text-red-600 hover:text-red-800 pr-10"
                  onClick={() => handleDeleteMilestone(milestone.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Objectives Table */}
            {/* {milestone.objectives.length > 0 && ( */}
            <div className="p-4 shadow-lg bg-white rounded-lg mt-3">
              <div>
                <p className="font-bold">Objectives</p>
              </div>
              <table className="w-full mt-2 text-left text-sm border rounded shadow-lg">
                <thead>
                  <tr className="border-b bg-gray-200">
                    <th className="p-2">Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Days</th>
                    <th className="p-2">Interactions</th>
                    <th className="p-2">Roadmap Type</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(milestone.objectives || []).map((objective) => (
                    // <tr key={objective.id} className="border-b">
                    //   {/* Objective Name */}
                    //   <td>
                    //     <input
                    //       type="text"
                    //       value={objective.name}
                    //       onChange={(e) =>
                    //         handleObjectiveChange(
                    //           e,
                    //           milestone.id,
                    //           objective.id,
                    //           "name"
                    //         )
                    //       }
                    //       onBlur={() =>
                    //         handleUpdateObjective(objective)
                    //       }
                    //       className="border px-2 py-1 rounded w-full"
                    //     />
                    //   </td>

                    //   {/* Description */}
                    //   <td>
                    //     <input
                    //       type="text"
                    //       value={objective.description}
                    //       onChange={(e) =>
                    //         handleObjectiveChange(
                    //           e,
                    //           milestone.id,
                    //           objective.id,
                    //           "description"
                    //         )
                    //       }
                    //       onBlur={() =>
                    //         handleUpdateObjective(milestone.id, objective)
                    //       }
                    //       className="border px-2 py-1 rounded w-full"
                    //     />
                    //   </td>

                    //   {/* Days */}
                    //   <td>
                    //     <input
                    //       type="number"
                    //       value={objective.objectiveDays}
                    //       onChange={(e) =>
                    //         handleObjectiveChange(
                    //           e,
                    //           milestone.id,
                    //           objective.id,
                    //           "objectiveDays"
                    //         )
                    //       }
                    //       onBlur={() =>
                    //         handleUpdateObjective(milestone.id, objective)
                    //       }
                    //       className="border px-2 py-1 rounded w-full"
                    //     />
                    //   </td>

                    //   {/* Number of Interactions */}
                    //   <td>
                    //     <input
                    //       type="number"
                    //       value={objective.noOfInteractions}
                    //       onChange={(e) =>
                    //         handleObjectiveChange(
                    //           e,
                    //           milestone.id,
                    //           objective.id,
                    //           "noOfInteractions"
                    //         )
                    //       }
                    //       onBlur={() =>
                    //         handleUpdateObjective(milestone.id, objective)
                    //       }
                    //       className="border px-2 py-1 rounded w-full"
                    //     />
                    //   </td>

                    //   {/* Roadmap Type Dropdown */}
                    //   <td>
                    //     <select
                    //       value={objective.roadmapType}
                    //       onChange={(e) =>
                    //         handleObjectiveChange(
                    //           e,
                    //           milestone.id,
                    //           objective.id,
                    //           "roadmapType"
                    //         )
                    //       }
                    //       onBlur={() =>
                    //         handleUpdateObjective(milestone.id, objective)
                    //       }
                    //       className="border px-2 py-1 rounded w-full"
                    //     >
                    //       <option value="CUSTOM">Custom</option>
                    //       <option value="DEFAULT">Default</option>
                    //     </select>
                    //   </td>

                    //   {/* Delete Button */}
                    //   <td>
                    //     <button
                    //       className="text-red-600 hover:text-red-800 ml-6"
                    //       onClick={() =>
                    //         handleDeleteObjective(milestone.id, objective.id)
                    //       }
                    //     >
                    //       <FaTrash />
                    //     </button>
                    //   </td>
                    // </tr>
                    <tr key={objective.id} className="border-b">
                      {/* Objective Name */}
                      <td>
                        <input
                          type="text"
                          value={objective.name}
                          onChange={(e) =>
                            handleObjectiveChange(
                              e,
                              milestone.id,
                              objective.id,
                              "name"
                            )
                          }
                          onBlur={() =>
                            handleUpdateObjective(milestone.id, objective)
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>

                      {/* Description */}
                      <td>
                        <input
                          type="text"
                          value={objective.description}
                          onChange={(e) =>
                            handleObjectiveChange(
                              e,
                              milestone.id,
                              objective.id,
                              "description"
                            )
                          }
                          onBlur={() =>
                            handleUpdateObjective(milestone.id, objective)
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>

                      {/* Days */}
                      <td>
                        <input
                          type="number"
                          value={objective.objectiveDays}
                          onChange={(e) =>
                            handleObjectiveChange(
                              e,
                              milestone.id,
                              objective.id,
                              "objectiveDays"
                            )
                          }
                          onBlur={() =>
                            handleUpdateObjective(milestone.id, objective)
                          } // ✅ Corrected
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>

                      {/* Number of Interactions */}
                      <td>
                        <input
                          type="number"
                          value={objective.noOfInteractions}
                          onChange={(e) =>
                            handleObjectiveChange(
                              e,
                              milestone.id,
                              objective.id,
                              "noOfInteractions"
                            )
                          }
                          onBlur={() =>
                            handleUpdateObjective(milestone.id, objective)
                          } // ✅ Corrected
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>

                      {/* Roadmap Type Dropdown */}
                      <td>
                        <select
                          value={objective.roadmapType}
                          onChange={(e) =>
                            handleObjectiveChange(
                              e,
                              milestone.id,
                              objective.id,
                              "roadmapType"
                            )
                          }
                          onBlur={() =>
                            handleUpdateObjective(milestone.id, objective)
                          } // ✅ Corrected
                          className="border px-2 py-1 rounded w-full"
                        >
                          <option value="CUSTOM">Custom</option>
                          <option value="DEFAULT">Default</option>
                        </select>
                      </td>

                      {/* Delete Button */}
                      <td>
                        <button
                          className="text-red-600 hover:text-red-800 ml-6"
                          onClick={() =>
                            handleDeleteObjective(milestone.id, objective.id)
                          }
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Add Objective Form */}
                {showObjectiveForm === milestone.id && (
                  <tbody>
                    <tr className="border-b">
                      <td>
                        <input
                          type="text"
                          value={newObjective.name}
                          onChange={(e) =>
                            setNewObjective((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Objective Name"
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newObjective.description}
                          onChange={(e) =>
                            setNewObjective((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Description"
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={newObjective.objectiveDays}
                          onChange={(e) =>
                            setNewObjective((prev) => ({
                              ...prev,
                              objectiveDays: parseInt(e.target.value),
                            }))
                          }
                          placeholder="Days"
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={newObjective.noOfInteractions}
                          onChange={(e) =>
                            setNewObjective((prev) => ({
                              ...prev,
                              noOfInteractions: parseInt(e.target.value),
                            }))
                          }
                          placeholder="Interactions"
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td>
                        <select
                          value={newObjective.roadmapType}
                          onChange={(e) =>
                            setNewObjective((prev) => ({
                              ...prev,
                              roadmapType: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded w-full"
                        >
                          <option value="CUSTOM">Custom</option>
                          <option value="DEFAULT">Default</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => addObjective(milestone.id)}
                          className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
            {/* )} */}

            {/* Add Objective Button */}
            <div className="text-center mt-4">
              <button
                className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                onClick={() => setShowObjectiveForm(milestone.id)}
              >
                + Add Objective
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Milestone Form */}

      {showMilestoneForm && (
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
                  onClick={(e) => {
                    e.target.disabled = true;
                    addMilestone();
                  }}
                  className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowMilestoneForm(false)}
                  className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <button
          className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
          onClick={() => setShowMilestoneForm(true)}
        >
          + Add Milestone
        </button>
      </div>

      {/* Edit Popup */}
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
