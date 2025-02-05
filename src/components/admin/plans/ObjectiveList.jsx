import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "../../../api/axios";

const ObjectiveList = ({
  milestone,
  setListOfMilestone,
  planId,
  token,
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
      console.log("Objective updated");
    } catch (error) {
      console.error("Error updating objective:", error);
    }
  };

  const handleDeleteObjective = async (objectiveId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this objective? ${objectiveId}`
      )
    )
      return;

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

      alert(`Objective ${objectiveId} deleted`);
    } catch (error) {
      console.error("Error deleting objective:", error);
    }
  };

  // const addObjective = async () => {
  //   const objectiveData = {
  //     ...newObjective,
  //     objectiveDays: parseInt(newObjective.objectiveDays) || 0,
  //     noOfInteractions: parseInt(newObjective.noOfInteractions) || 0,
  //     milestoneId: milestone.id,
  //   };

  //   if (
  //     !newObjective.name ||
  //     !newObjective.description ||
  //     newObjective.objectiveDays <= 0 ||
  //     newObjective.noOfInteractions <= 0
  //   ) {
  //     alert(
  //       "Please fill all fields and ensure days and interactions are greater than 0."
  //     );
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `/api/plans/${planId}/create/objective`,
  //       objectiveData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("response",response.data);

  //     console.log(objectiveData);

  //     // Update the state with the new objective
  //     setListOfMilestone((prevMilestones) =>
  //       prevMilestones.map((milestoneItem) =>
  //         milestoneItem.id === milestone.id
  //           ? {
  //               ...milestoneItem,
  //               objectives: [...milestoneItem.objectives, response.data],
  //             }
  //           : milestoneItem
  //       )
  //     );

  //     // Close the form
  //     setShowObjectiveForm(null);

  //     // Reset the form
  //     setNewObjective({
  //       name: "",
  //       description: "",
  //       objectiveDays: null,
  //       noOfInteractions: null,
  //       roadmapType: "DEFAULT",
  //       milestoneId: milestone.id,
  //     });

  //   } catch (error) {
  //     console.error("Error adding objective:", error);
  //   }
  // };

  const addObjective = async () => {
    const objectiveData = {
      ...newObjective,
      objectiveDays: parseInt(newObjective.objectiveDays) || 0,
      noOfInteractions: parseInt(newObjective.noOfInteractions) || 0,
      milestoneId: milestone.id, // Ensure milestoneId is set
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

      console.log("response", response.data);

      // Extract the new objective from the response
      const newObjectiveData = response.data.data[0]; // Access the first item in the data array

      // Update the state with the new objective
      setListOfMilestone((prevMilestones) =>
        prevMilestones.map((milestoneItem) =>
          milestoneItem.id === milestone.id
            ? {
                ...milestoneItem,
                objectives: [...milestoneItem.objectives, newObjectiveData], // Use newObjectiveData
              }
            : milestoneItem
        )
      );

      // Close the form
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
    }
  };
  return (
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
              <td>
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
              </td>
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
                <div className="flex gap-2">
                  <button
                    onClick={addObjective}
                    className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
                  >
                    Save
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
