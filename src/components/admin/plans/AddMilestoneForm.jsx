// import React, { useState } from "react";
// import axios from "../../../api/axios";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

// const AddMilestoneForm = ({
//   setShowMilestoneForm,
//   refreshData,
//   planId,
//   currentMilestones,
//   planDays,
//   startDate,
//   endDate,
// }) => {
//   const [newMilestone, setNewMilestone] = useState({
//     name: "",
//     mentorName: "",
//     milestoneDays: null,
//     startDate: startDate,
//     endDate: null,
//   });

//   const { mentors } = useSelector((state) => state.data);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const totalMilestoneDays = currentMilestones.reduce(
//     (sum, milestone) => sum + parseInt(milestone.milestoneDays),
//     0
//   );

//   const calculateEndDate = (startDate, days) => {
//     const date = new Date(startDate);
//     date.setDate(date.getDate() + days);
//     return date.toISOString().split("T")[0];
// };

//   const handleStartDateChange = (e) => {
//     const startDate = e.target.value;
//     let endDate = "";
//     if(newMilestone.milestoneDays){
//       endDate = calculateEndDate(startDate, newMilestone.milestoneDays);
//     }
//     setNewMilestone((prev) => ({
//       ...prev,
//       startDate,
//       endDate,
//     }));
//   };

//   const handleDaysChange = (e) => {
//     const milestoneDays = parseInt(e.target.value, 10);
//     const endDate = calculateEndDate(newMilestone.startDate, milestoneDays);
//     setNewMilestone((prev) => ({
//       ...prev,
//       milestoneDays,
//       endDate,
//     }));
//   };

//   const addMilestone = async () => {
//     const milestoneDays = parseInt(newMilestone.milestoneDays, 10);

//     if (!newMilestone.name || !newMilestone.mentorName || milestoneDays <= 0) {
//       toast.error("Please fill all fields and ensure days are greater than 0.");
//       return;
//     }

//     if (parseInt(totalMilestoneDays) + parseInt(milestoneDays) > planDays) {
//       toast.error(`Total milestone days cannot exceed ${planDays}!`);
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const response = await axios.post(
//         `/api/plans/${planId}/create/milestone`,
//         newMilestone
//       );

//       setShowMilestoneForm(false);
//       toast.success("Milestone added successfully!");

//       setNewMilestone({
//         name: "",
//         mentorName: "",
//         milestoneDays: null,
//         startDate: startDate,
//         endDate: null,
//       });
//       refreshData();
//     } catch (error) {
//       console.error("Error adding milestone:", error);
//       toast.error("Failed to add milestone.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mt-6 p-4 border rounded-lg bg-gray-100">
//       <div className="bg-white p-2 shadow-lg rounded-lg">
//         <h1 className="mb-3 ml-3 font-bold">Add Milestone</h1>
//         <div className="flex justify-between gap-2 items-center border-b pb-2">
//           <div className="relative">
//             <input
//               type="text"
//               value={newMilestone.name}
//               onChange={(e) =>
//                 setNewMilestone((prev) => ({ ...prev, name: e.target.value }))
//               }
//               className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             />
//             <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
//               Name
//             </label>
//           </div>

//           <div className="relative">
//             <select
//               value={newMilestone.mentorName}
//               onChange={(e) =>
//                 setNewMilestone((prev) => ({
//                   ...prev,
//                   mentorName: e.target.value,
//                 }))
//               }
//               className="block px-2.5 pb-2.5 pt-4 min-w-full w-56 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             >
//               <option value="" disabled hidden>
//                 Select a mentor
//               </option>
//               {mentors.map((mentor) => (
//                 <option key={mentor} value={mentor}>
//                   {mentor}
//                 </option>
//               ))}
//             </select>
//             <label className="absolute text-md text-gray-500 transform -translate-y-4 scale-75 top-2 z-5 bg-white px-2 ml-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2 peer-focus:text-blue-600">
//               Mentor
//             </label>
//           </div>

//           <div className="relative">
//             <input
//               type="number"
//               value={newMilestone.milestoneDays}
//               onChange={handleDaysChange}
//               className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             />
//             <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
//               Days
//             </label>
//           </div>

//           <div className="relative">
//             <input
//               type="date"
//               value={new Date(newMilestone.startDate).toISOString().slice(0, 10)}
//               // value={newMilestone.startDate}
//               onChange={handleStartDateChange}
//               min={startDate}
//               max={endDate}
//               className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             />
//             <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
//               Start Date
//             </label>
//           </div>

//           <div className="relative">
//             <input
//               type="date"
//               value={newMilestone.endDate}
//               readOnly
//               className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             />
//             <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
//               End Date
//             </label>
//           </div>

//           <div className="flex gap-2 justify-around w-1/6">
//             <button
//               onClick={addMilestone}
//               className={`text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 transition ${
//                 isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Saving..." : "Save"}
//             </button>

//             <button
//               onClick={() => setShowMilestoneForm(false)}
//               className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMilestoneForm;












import React, { useState } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddMilestoneForm = ({
  setShowMilestoneForm,
  refreshData,
  planId,
  currentMilestones,
  planDays,
  startDate,
  endDate
}) => {
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    mentorName: "",
    milestoneDays: null,
  });

  const { mentors } = useSelector((state) => state.data);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalMilestoneDays = currentMilestones.reduce(
    (sum, milestone) => sum + parseInt(milestone.milestoneDays),
    0
  );

  const addMilestone = async () => {
    const milestoneDays = parseInt(newMilestone.milestoneDays, 10);

    if (!newMilestone.name || !newMilestone.mentorName || milestoneDays <= 0) {
      toast.error("Please fill all fields and ensure days are greater than 0.");
      return;
    }

    if (parseInt(totalMilestoneDays) + parseInt(milestoneDays) > planDays) {
      toast.error(`Total milestone days cannot exceed ${planDays}!`);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `/api/plans/${planId}/create/milestone`,
        newMilestone
      );

      setShowMilestoneForm(false);
      toast.success("Milestone added successfully!");

      setNewMilestone({ name: "", mentorName: "", milestoneDays: null });
      refreshData();
    } catch (error) {
      console.error("Error adding milestone:", error.response);
      toast.error(JSON.stringify(error.response?.data?.message) || "Failed to add milestone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-100">
      <div className="bg-white p-2 shadow-lg rounded-lg">
        <h1 className="mb-3 ml-3 font-bold">Add Milestone</h1>
        <div className="flex justify-between gap-2 items-center border-b pb-2">
          <div className="relative">
            <input
              type="text"
              value={newMilestone.name}
              onChange={(e) =>
                setNewMilestone((prev) => ({ ...prev, name: e.target.value }))
              }
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Name
            </label>
          </div>

          <div className="relative">
            <select
              value={newMilestone.mentorName}
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  mentorName: e.target.value,
                }))
              }
              className="block px-2.5 pb-2.5 pt-4 min-w-full w-56 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="" disabled hidden>

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
              value={newMilestone.milestoneDays}
              onChange={(e) =>
                setNewMilestone((prev) => ({
                  ...prev,
                  milestoneDays: parseInt(e.target.value, 10),
                }))
              }
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 ml-2">
              Days
            </label>
          </div>

          <div className="flex gap-2 justify-around w-1/6">
            <button
              onClick={addMilestone}
              className={`text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
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
