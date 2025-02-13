import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ObjectiveList = ({
  milestone,
  setListOfMilestone,
  planId,
  showObjectiveForm,
  setShowObjectiveForm,
}) => {
  const [newObjective, setNewObjective] = useState({
    name: "",
    description: "",
    objectiveDays: null,
    noOfInteractions: null,
    roadmapType: "DEFAULT",
    milestoneId: milestone.id,
  });

  const { token } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total existing objective days
  const totalObjectiveDays = milestone.objectives.reduce(
    (sum, obj) => sum + obj.objectiveDays,
    0
  );

  const handleObjectiveChange = (e, objectiveId, field) => {
    let { value } = e.target;
    if (field === "objectiveDays" || field === "noOfInteractions") {
      value = Number(value);
    }

    setListOfMilestone((prevMilestones) =>
      prevMilestones.map((milestoneItem) =>
        milestoneItem.id === milestone.id
          ? {
              ...milestoneItem,
              objectives: milestoneItem.objectives.map((objective) =>
                objective.id === objectiveId
                  ? { ...objective, [field]: value }
                  : objective
              ),
            }
          : milestoneItem
      )
    );
  };

  const handleUpdateObjective = async (objective) => {
    try {
      if (totalObjectiveDays + objective.objectiveDays > milestone.milestoneDays) {
        toast.error(
          `Total objective days cannot exceed ${milestone.milestoneDays}!`
        );
        return;
      }
      await axios.patch(
        `/api/plans/${planId}/update/objective`,
        {
          objectiveId: objective.id,
          objectiveData: {
            name: objective.name,
            description: objective.description,
            objectiveDays: objective.objectiveDays,
            noOfInteractions: objective.noOfInteractions,
            roadmapType: objective.roadmapType,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating objective:", error);
    }
  };



  const handleDeleteObjective = async (objectiveId) => {
    try {
      await axios.delete(`/api/plans/delete/objective/${objectiveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setListOfMilestone((prevMilestones) =>
        prevMilestones.map((milestoneItem) =>
          milestoneItem.id === milestone.id
            ? {
                ...milestoneItem,
                objectives: milestoneItem.objectives.filter(
                  (objective) => objective.id !== objectiveId
                ),
              }
            : milestoneItem
        )
      );
  
      toast.success(`Objective ${objectiveId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting objective:", error);
      toast.error("Failed to delete objective. Please try again.");
    }
  };
  

  const addObjective = async () => {
    const objectiveDays = parseInt(newObjective.objectiveDays) || 0;
    const noOfInteractions = parseInt(newObjective.noOfInteractions) || 0;

    // Validation
    if (
      !newObjective.name ||
      !newObjective.description ||
      objectiveDays <= 0 ||
      noOfInteractions <= 0
    ) {
      toast.error(
        "Please fill all fields and ensure values are greater than 0."
      );
      return;
    }

    if (totalObjectiveDays + objectiveDays > milestone.milestoneDays) {
      toast.error(
        `Total objective days cannot exceed ${milestone.milestoneDays}!`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `/api/plans/${planId}/create/objective`,
        {
          ...newObjective,
          objectiveDays,
          noOfInteractions,
          milestoneId: milestone.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newObjectiveData = response.data.data[0];

      // Update the milestone with the new objective
      setListOfMilestone((prevMilestones) =>
        prevMilestones.map((milestoneItem) =>
          milestoneItem.id === milestone.id
            ? {
                ...milestoneItem,
                objectives: [...milestoneItem.objectives, newObjectiveData],
              }
            : milestoneItem
        )
      );

      toast.success("Objective added successfully!");
      setShowObjectiveForm(null);

      // Reset the form
      setNewObjective({
        name: "",
        description: "",
        objectiveDays: null,
        noOfInteractions: null,
        roadmapType: "DEFAULT",
        milestoneId: milestone.id,
      });
    } catch (error) {
      console.error("Error adding objective:", error);
      toast.error("Failed to add objective.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 shadow-lg bg-white rounded-lg mt-3 overflow-x-auto">
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
            {/* <th className="p-2">Roadmap Type</th> */}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(milestone.objectives || []).map((objective) => (
            <tr key={objective.id} className="border-b">
              <td>
                <input
                  type="text"
                  value={objective.name}
                  onChange={(e) =>
                    handleObjectiveChange(e, objective.id, "name")
                  }
                  onBlur={() => handleUpdateObjective(objective)}
                  className="border px-2 py-1 rounded w-full"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={objective.description}
                  onChange={(e) =>
                    handleObjectiveChange(e, objective.id, "description")
                  }
                  onBlur={() => handleUpdateObjective(objective)}
                  className="border px-2 py-1 rounded w-full"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={objective.objectiveDays}
                  onChange={(e) =>
                    handleObjectiveChange(e, objective.id, "objectiveDays")
                  }
                  onBlur={() => handleUpdateObjective(objective)}
                  className="border px-2 py-1 rounded w-full"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={objective.noOfInteractions}
                  onChange={(e) =>
                    handleObjectiveChange(e, objective.id, "noOfInteractions")
                  }
                  onBlur={() => handleUpdateObjective(objective)}
                  className="border px-2 py-1 rounded w-full"
                />
              </td>
              {/* <td>
                <select
                  value={objective.roadmapType}
                  onChange={(e) =>
                    handleObjectiveChange(e, objective.id, "roadmapType")
                  }
                  onBlur={() => handleUpdateObjective(objective)}
                  className="border px-2 py-1 rounded w-full"
                >
                  <option value="CUSTOM">Custom</option>
                  <option value="DEFAULT">Default</option>
                </select>
              </td> */}
              <td>
                <button
                  className="text-red-600 hover:text-red-800 ml-6"
                  onClick={() => handleDeleteObjective(objective.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

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
              {/* <td>
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
              </td> */}
              <td> 
                <div className="flex gap-2">
                  <button
                    onClick={addObjective}
                    className={`text-sm bg-gray-700 text-white px-3 py-1 rounded ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-900"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setShowObjectiveForm(null)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>

      <div className="text-center mt-4">
        <button
          className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
          onClick={() => setShowObjectiveForm(milestone.id)}
        >
          + Add Objective
        </button>
      </div>
    </div>
  );
};

export default ObjectiveList;
