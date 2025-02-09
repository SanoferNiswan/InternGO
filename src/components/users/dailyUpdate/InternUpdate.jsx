import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { FaTrash } from "react-icons/fa";

const InternUpdate = () => { 
  const { date } = useParams();
  const { token, userId } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [originalTasks, setOriginalTasks] = useState([]);

  const isEditable = () => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    return date === today || date === tomorrowStr;
  };

  const fetchDailyUpdates = async () => {
    try {
      const response = await axios.get(`/api/dailyUpdates/${userId}?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.statusCode === 200) {
        setTasks(response.data.data.tasks || []);
        setOriginalTasks(response.data.data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching daily updates:", error);
    }
  };

  useEffect(() => {
    fetchDailyUpdates();
  }, [date, token, userId]);

  const handleInputChange = (index, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      )
    );
  };

  const addNewTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: null, taskName: "", activitiesPlanned: "", activitiesCompleted: "", estimatedTime: "", actualTime: "", taskProgress: "PENDING" },
    ]);
  };

  const saveChanges = async () => {
    try {
      const formattedTasks = tasks.map((task) => ({
        taskData: {
          taskName: task.taskName,
          activitiesPlanned: task.activitiesPlanned,
          activitiesCompleted: task.activitiesCompleted,
          estimatedTime: Number(task.estimatedTime),
          actualTime: Number(task.actualTime),
          taskProgress: task.taskProgress || "PENDING",
        },
        ...(task.id && { taskId: task.id }), // Include taskId if it's an existing task
      }));

      await axios.post(`/api/dailyUpdates/${userId}/create`, { date, tasks: formattedTasks }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDailyUpdates(); 
    } catch (error) {
      console.error("Error saving daily updates:", error);
    }
  };

  const deleteTask = async (taskId, index) => {
    try {
      if (taskId) {
        await axios.delete(`/api/dailyUpdates/delete/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Daily Updates - {date}</h2>

      <table className="w-full shadow-md rounded-lg border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Task Name</th>
            <th className="border p-2">Planned Activities</th>
            <th className="border p-2">Completed Activities</th>
            <th className="border p-2">Estimated Time (hrs)</th>
            <th className="border p-2">Actual Time (hrs)</th>
            <th className="border p-2">Progress</th>
            {isEditable() && <th className="border p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">
                  <input
                    type="text"
                    value={task.taskName}
                    className="border w-full p-1"
                    readOnly={!isEditable()}
                    onChange={(e) => handleInputChange(index, "taskName", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={task.activitiesPlanned}
                    className="border w-full p-1"
                    readOnly={!isEditable()}
                    onChange={(e) => handleInputChange(index, "activitiesPlanned", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={task.activitiesCompleted}
                    className="border w-full p-1"
                    readOnly={!isEditable()}
                    onChange={(e) => handleInputChange(index, "activitiesCompleted", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={task.estimatedTime}
                    className="border w-full p-1"
                    readOnly={!isEditable()}
                    onChange={(e) => handleInputChange(index, "estimatedTime", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={task.actualTime}
                    className="border w-full p-1"
                    readOnly={!isEditable()}
                    onChange={(e) => handleInputChange(index, "actualTime", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <select
                    className="border w-full p-1"
                    value={task.taskProgress}
                    disabled={!isEditable()}
                    onChange={(e) => handleInputChange(index, "taskProgress", e.target.value)}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
                {isEditable() && (
                  <td className="border p-2">
                    <button onClick={() => deleteTask(task.id, index)} className="px-2 py-1 text-red-500 rounded-md hover:text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isEditable() && (
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={addNewTask} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Add Task
          </button>
          <button onClick={saveChanges} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default InternUpdate;




// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import axios from "../../../api/axios";
// import { FaTrash } from "react-icons/fa";

// const InternUpdate = () => {
//   const { date } = useParams();
//   const { token, userId } = useSelector((state) => state.auth);
//   const [tasks, setTasks] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [originalTasks, setOriginalTasks] = useState([]);
  
//   const isEditable = () => {
//     const today = new Date().toISOString().split("T")[0];
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const tomorrowStr = tomorrow.toISOString().split("T")[0];

//     return date === today || date === tomorrowStr;
//   };

//   useEffect(() => {
//     const fetchDailyUpdates = async () => {
//       try {
//         const response = await axios.get(`/api/dailyUpdates/${userId}?date=${date}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data.statusCode === 200) {
//           setTasks(response.data.data.tasks);
//           setOriginalTasks(response.data.data.tasks); // Store original tasks for cancel
//         }
//       } catch (error) {
//         console.error("Error fetching daily updates:", error);
//       }
//     };

//     fetchDailyUpdates();
//   }, [date, token, userId]);

//   const handleInputChange = (index, field, value) => {
//     const updatedTasks = [...tasks];
//     updatedTasks[index] = { ...updatedTasks[index], [field]: value };
//     setTasks(updatedTasks);
//   };

//   const addNewTask = () => {
//     setTasks([...tasks, { taskName: "", activitiesPlanned: "", activitiesCompleted: "", estimatedTime: "", actualTime: "", taskProgress: "PENDING" }]);
//   };

//   // Cancel edit and restore original tasks
//   const cancelEdit = () => {
//     setTasks(originalTasks);
//     setIsEditing(false);
//   };


//   const saveChanges = async () => {
//     try {
//       const formattedTasks = tasks.map(d => {
//         const newTask = {
//           taskData: {
//             taskName: d.taskName,
//             activitiesPlanned: d.activitiesPlanned,
//             activitiesCompleted: d.activitiesCompleted,
//             estimatedTime: Number(d.estimatedTime),
//             actualTime: Number(d.actualTime),
//             taskProgress: d.taskProgress || 'PENDING'
//           }
//         };
//         if (Number(d.id)) {
//           newTask.taskId = d.id;
//         }
//         return newTask;
//       });
  
//       await axios.post(`/api/dailyUpdates/${userId}/create`, {
//         date,
//         tasks: formattedTasks
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       setOriginalTasks(tasks);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error saving daily updates:", error);
//     }
//   };
  
  

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Daily Updates - {date}</h2>

//       {isEditable() && !isEditing && (
//         <button
//           onClick={() => setIsEditing(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600"
//         >
//           Edit
//         </button>
//       )}

//       {isEditing && (
//         <div className="mb-4">
//           <button onClick={saveChanges} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600">
//             Save Changes
//           </button>
//           <button onClick={cancelEdit} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
//             Cancel
//           </button>
//           <button onClick={addNewTask} className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-600">
//             Add Task
//           </button>
//         </div>
//       )}

//       <table className="w-full shadow-md rounded-lg border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Task Name</th>
//             <th className="border p-2">Planned Activities</th>
//             <th className="border p-2">Completed Activities</th>
//             <th className="border p-2">Estimated Time (hrs)</th>
//             <th className="border p-2">Actual Time (hrs)</th>
//             <th className="border p-2">Progress</th>
//             {isEditing && <th className="border p-2">Action</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {tasks ? tasks.map((task, index) => (
//             <tr key={index} className="text-center">
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={task.taskName}
//                   className="border w-full p-1"
//                   readOnly={!isEditing}
//                   onChange={(e) => handleInputChange(index, "taskName", e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={task.activitiesPlanned}
//                   className="border w-full p-1"
//                   readOnly={!isEditing}
//                   onChange={(e) => handleInputChange(index, "activitiesPlanned", e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={task.activitiesCompleted}
//                   className="border w-full p-1"
//                   readOnly={!isEditing}
//                   onChange={(e) => handleInputChange(index, "activitiesCompleted", e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   value={task.estimatedTime}
//                   className="border w-full p-1"
//                   readOnly={!isEditing}
//                   onChange={(e) => handleInputChange(index, "estimatedTime", e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   value={task.actualTime}
//                   className="border w-full p-1"
//                   readOnly={!isEditing}
//                   onChange={(e) => handleInputChange(index, "actualTime", e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <select
//                   className="border w-full p-1"
//                   value={task.taskProgress}
//                   disabled={!isEditing}
//                   onChange={(e) => handleInputChange(index, "taskProgress", e.target.value)}
//                 >
//                   <option value="PENDING">PENDING</option>
//                   <option value="COMPLETED">COMPLETED</option>
//                 </select>
//               </td>
//               {isEditing && (
//                 <td className="border p-2">
//                   <button
//                     onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
//                     className="px-2 py-1 text-red-500 rounded-md hover:text-red-600"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               )}
//             </tr>
//           )) : <div>No tasks found</div>}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InternUpdate;


