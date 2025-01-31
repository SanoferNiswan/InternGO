import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditPlanPopup from './EditPlanPopup';

const Milestones = () => {
  const { planId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [planDetails, setPlanDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMilestone, setUpdatedMilestone] = useState({});
  const [updatedObjective, setUpdatedObjective] = useState({});

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`/api/plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlanDetails(response.data.data);
      } catch (error) {
        console.error('Error fetching plan details:', error);
      }
    };
    fetchPlanDetails();
  }, [planId, token]);

  // Handle input change for milestone fields
  const handleMilestoneChange = (e, milestoneId) => {
    const { name, value } = e.target;
    setUpdatedMilestone((prev) => ({
      ...prev,
      [milestoneId]: { ...prev[milestoneId], [name]: value },
    }));
  };

  // Handle milestone update on blur
  const handleMilestoneUpdate = async (milestoneId) => {
    if (!updatedMilestone[milestoneId]) return;
    try {
      await axios.post(
        `/api/plans/${planId}/update/milestone`,
        { milestoneId, objectiveData: updatedMilestone[milestoneId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  // Handle input change for objective fields
  const handleObjectiveChange = (e, milestoneId, objectiveId) => {
    const { name, value } = e.target;
    setUpdatedObjective((prev) => ({
      ...prev,
      [milestoneId]: {
        ...prev[milestoneId],
        [objectiveId]: { ...prev[milestoneId]?.[objectiveId], [name]: value },
      },
    }));
  };

  // Handle objective update on blur
  const handleObjectiveUpdate = async (milestoneId, objectiveId) => {
    if (!updatedObjective[milestoneId]?.[objectiveId]) return;
    try {
      await axios.patch(
        `/api/plans/${planId}/update/objective`,
        { objectiveId, objectiveData: updatedObjective[milestoneId][objectiveId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating objective:', error);
    }
  };

  if (!planDetails) return <div>Loading...</div>;

  return (
    <div className="shadow-md p-4 rounded-lg bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-lg font-semibold">Plan Name: {planDetails.name}</div>
        <div className="text-gray-600">{planDetails.planDays} Days</div>
      </div>
      <p className="text-gray-700 p-4">{planDetails.description}</p>

      {/* Milestones Section */}
      <div className="mt-6 space-y-4">
        {planDetails.milestones.map((milestone) => (
          <div key={milestone.id} className="p-4 border rounded-lg bg-gray-100">
            <div className="bg-white p-2 shadow-lg rounded-lg">
              <p className="p-2 font-bold">Milestone {milestone.id}</p>

              {/* Editable Milestone Fields */}
              <div className="flex justify-between items-center border-b pb-2">
                <input
                  type="text"
                  name="name"
                  value={updatedMilestone[milestone.id]?.name || milestone.name}
                  onChange={(e) => handleMilestoneChange(e, milestone.id)}
                  onBlur={() => handleMilestoneUpdate(milestone.id)}
                  className="border p-2 rounded w-1/3"
                />
                <input
                  type="text"
                  name="mentorName"
                  value={updatedMilestone[milestone.id]?.mentorName || milestone.mentorName}
                  onChange={(e) => handleMilestoneChange(e, milestone.id)}
                  onBlur={() => handleMilestoneUpdate(milestone.id)}
                  className="border p-2 rounded w-1/3"
                />
                <input
                  type="number"
                  name="milestoneDays"
                  value={updatedMilestone[milestone.id]?.milestoneDays || milestone.milestoneDays}
                  onChange={(e) => handleMilestoneChange(e, milestone.id)}
                  onBlur={() => handleMilestoneUpdate(milestone.id)}
                  className="border p-2 rounded w-1/3"
                />
                <button className="text-red-600 hover:text-red-800 pr-10">
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Objectives Table */}
            {milestone.objectives.length > 0 && (
              <div className="p-4 shadow-lg bg-white rounded-lg mt-3">
                <p className="font-bold">Objectives</p>
                <table className="w-full mt-2 text-left text-sm border rounded shadow-lg">
                  <thead>
                    <tr className="border-b bg-gray-200">
                      <th className="p-2">Name</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Days</th>
                      <th className="p-2">Interactions</th>
                      <th className="p-2">Roadmap Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestone.objectives.map((objective) => (
                      <tr key={objective.id} className="border-b">
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={updatedObjective[milestone.id]?.[objective.id]?.name || objective.name}
                            onChange={(e) => handleObjectiveChange(e, milestone.id, objective.id)}
                            onBlur={() => handleObjectiveUpdate(milestone.id, objective.id)}
                            className="border p-2 rounded w-full"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="description"
                            value={updatedObjective[milestone.id]?.[objective.id]?.description || objective.description}
                            onChange={(e) => handleObjectiveChange(e, milestone.id, objective.id)}
                            onBlur={() => handleObjectiveUpdate(milestone.id, objective.id)}
                            className="border p-2 rounded w-full"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="objectiveDays"
                            value={updatedObjective[milestone.id]?.[objective.id]?.objectiveDays || objective.objectiveDays}
                            onChange={(e) => handleObjectiveChange(e, milestone.id, objective.id)}
                            onBlur={() => handleObjectiveUpdate(milestone.id, objective.id)}
                            className="border p-2 rounded w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// const Milestones = () => {
//   const { planId } = useParams();
//   const { token } = useSelector((state) => state.auth);
//   const [planDetails, setPlanDetails] = useState(null);
//   const [updatedData, setUpdatedData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [planData, setPlanData] = useState(planDetails);

//   const handleUpdate = (updatedPlan) => {
//     setPlanData(updatedPlan); 
//   };

//   useEffect(() => {
//     const fetchPlanDetails = async () => {
//       try {
//         const response = await axios.get(`/api/plans/${planId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log(response.data.data);
        
//         setPlanDetails(response.data.data);
//       } catch (error) {
//         console.error('Error fetching plan details:', error);
//       }
//     };

//     fetchPlanDetails();
//   }, [planId, token]);

//   const handleInputChange = (e, milestoneId, objectiveId) => {
//     const { name, value } = e.target;
//     setUpdatedData((prevData) => ({
//       ...prevData,
//       [milestoneId]: {
//         ...prevData[milestoneId],
//         objectives: prevData[milestoneId]?.objectives.map((objective) =>
//           objective.id === objectiveId
//             ? { ...objective, [name]: value }
//             : objective
//         ),
//       },
//     }));
//   };

//   const handleBlur = async (milestoneId, objectiveId) => {
//     const objectiveData = updatedData[milestoneId]?.objectives?.find(
//       (objective) => objective.id === objectiveId
//     );
//     if (objectiveData) {
//       try {
//         await axios.patch(
//           `/api/plans/${planId}/update/objective`,
//           {
//             objectiveId,
//             ...objectiveData,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (error) {
//         console.error('Error updating objective:', error);
//       }
//     }
//   };

//   const handleAddMilestone = async () => {
//     const newMilestone = {
//       name: 'New Milestone',
//       mentorName: 'Mentor',
//       milestoneDays: 30,
//     };
//     try {
//       const response = await axios.post(
//         `/api/plans/${planId}/create/milestone`,
//         newMilestone,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setPlanDetails((prevDetails) => ({
//         ...prevDetails,
//         milestones: [...prevDetails.milestones, response.data.data],
//       }));
//     } catch (error) {
//       console.error('Error adding milestone:', error);
//     }
//   };

//   const handleAddObjective = async (milestoneId) => {
//     const newObjective = {
//       name: 'old Objective',
//       milestoneId:2,
//       description: 'Objective Description',
//       objectiveDays: 10,
//       noOfInteractions: 2,
//       roadmapType: 'CUSTOM',
//     };
//     try {
//       const response = await axios.post(
//         `/api/plans/${planId}/create/objective`,
//         newObjective,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setPlanDetails((prevDetails) => {
//         const updatedMilestones = prevDetails.milestones.map((milestone) => {
//           if (milestone.id === milestoneId) {
//             return {
//               ...milestone,
//               objectives: [...milestone.objectives, response.data.data],
//             };
//           }
//           return milestone;
//         });
//         return {
//           ...prevDetails,
//           milestones: updatedMilestones,
//         };
//       });
//     } catch (error) {
//       console.error('Error adding objective:', error);
//     }
//   };

//   if (!planDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="shadow-md p-4 rounded-lg bg-white">
//       {/* Plan Header */}
//       <div className="flex justify-between items-center p-4 border-b">
//         <div className="text-lg font-semibold">Plan Name: {planDetails.name}</div>
//         <div className="text-gray-600">{planDetails.planDays} Days</div>
//       </div>
      
//       {/* Description */}
//       <p className="text-gray-700 p-4">{planDetails.description}</p>

//       {/* Actions */}
//       <div className="flex justify-end space-x-4">
//         <button className="text-blue-600 hover:text-blue-800 flex items-center" onClick={() => setIsEditing(true)}>
//           <FaEdit className="mr-2" /> Edit
//         </button>
//         <button className="text-red-600 hover:text-red-800 flex items-center">
//           <FaTrash className="mr-2" /> Delete
//         </button>
//       </div>

//       {/* Milestones */}
//       <div className="mt-6 space-y-4">
//         {planDetails.milestones.map((milestone) => (
//           <div key={milestone.id} className="p-4 border rounded-lg bg-gray-100">
//             {/* Milestone Header */}
//             <div className='bg-white p-2 shadow-lg rounded-lg'>
//             <div>
//               <p className='p-2 font-bold'>Milestone {milestone.id}</p>
//             </div>
//             <div className="flex justify-between items-center border-b pb-2">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={milestone.name}
//                   id={`name-${milestone.id}`}
//                   className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//                   onChange={(e) => handleInputChange(e, milestone.id)}
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor={`name-${milestone.id}`}
//                   className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600"
//                 >
//                   Name
//                 </label>
//               </div>

//               <div className="relative">
//                 <input
//                   type="text"
//                   value={milestone.mentorName}
//                   id={`mentor-${milestone.id}`}
//                   className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//                   onChange={(e) => handleInputChange(e, milestone.id)}
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor={`mentor-${milestone.id}`}
//                   className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600"
//                 >
//                   Mentor Name
//                 </label>
//               </div>

//               <div className="relative">
//                 <input
//                   type="number"
//                   value={milestone.milestoneDays}
//                   id={`days-${milestone.id}`}
//                   className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//                   onChange={(e) => handleInputChange(e, milestone.id)}
//                   placeholder=" "
//                 />
//                 <label
//                   htmlFor={`days-${milestone.id}`}
//                   className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600"
//                 >
//                   Number of Days
//                 </label>
//               </div>

//               <button className="text-red-600 hover:text-red-800 pr-10">
//                 <FaTrash />
//               </button>
//             </div>
//             </div>

//             {/* Objectives Table */}
//            { milestone.objectives.length>0 &&
//             <div className='p-4 shadow-lg bg-white rounded-lg mt-3'>
//               <div>
//                 <p className='font-bold'>Objectives</p>
//               </div>
//               <table className="w-full mt-2 text-left text-sm border rounded shadow-lg">
//               <thead>
//                 <tr className="border-b bg-gray-200">
//                   <th className="p-2">Name</th>
//                   <th className="p-2">Description</th>
//                   <th className="p-2">Days</th>
//                   <th className="p-2">Interactions</th>
//                   <th className="p-2">Roadmap Type</th>
//                   <th className="p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {milestone.objectives.map((objective) => (
//                   <tr key={objective.id} className="border-b">
//                     <td>
//                       <input
//                         type="text"
//                         value={objective.name}
//                         className="border px-2 py-1 rounded w-full"
//                         onChange={(e) => handleInputChange(e, milestone.id, objective.id)}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={objective.description}
//                         className="border px-2 py-1 rounded w-full"
//                         onChange={(e) => handleInputChange(e, milestone.id, objective.id)}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="number"
//                         value={objective.objectiveDays}
//                         className="border px-2 py-1 rounded w-full"
//                         onChange={(e) => handleInputChange(e, milestone.id, objective.id)}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="number"
//                         value={objective.noOfInteractions}
//                         className="border px-2 py-1 rounded w-full"
//                         onChange={(e) => handleInputChange(e, milestone.id, objective.id)}
//                       />
//                     </td>
//                     <td>
//                       <select
//                         value={objective.roadmapType}
//                         className="border px-2 py-1 rounded w-full"
//                         onChange={(e) => handleInputChange(e, milestone.id, objective.id)}
//                       >
//                         <option value="CUSTOM">Custom</option>
//                         <option value="DEFAULT">Default</option>
//                       </select>
//                     </td>
//                     <td>
//                       <button className="text-red-600 hover:text-red-800 ml-6">
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             </div>
//            }
//            {/* Add Objective Button */}
//             <div className="text-center mt-4">
//               <button className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900">
//                 + Add Objective
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Milestone Button */}
//       <div className="text-center mt-6">
//         <button className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900">
//           + Add Milestone
//         </button>
//       </div>

//       {/* Edit Popup */}
//       {isEditing && (
//         <EditPlanPopup
//           planDetails={planDetails}
//           onClose={() => setIsEditing(false)}
//           onUpdate={handleUpdate}
//           token={token}
//         />
//       )}
//     </div>
//   );
// };

export default Milestones;
