import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams,Navigate } from "react-router-dom";
import axios from "../../../api/axios";
import { FaTrash } from "react-icons/fa";
import { addDays, isAfter, parseISO, isValid } from "date-fns";
import Loader from "../../Loader";
import { toast } from "react-toastify";

const InternUpdate = () => { 
  const { date } = useParams();
  const [loading,setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const inputDate = parseISO(date);
  if (!isValid(inputDate)) {
    return <Navigate to="/not-found" replace />;
  }
 
  const today = new Date();
  const tomorrow = addDays(today, 1);

  if (isAfter(inputDate, tomorrow)) {
    return <Navigate to="/not-found" replace />;
  }


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
      setLoading(true);
      const response = await axios.get(`/api/dailyUpdates/${userId}?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.statusCode === 200) {
        setTasks(response.data.data.tasks || []);
        setOriginalTasks(response.data.data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching daily updates:", error);
    }finally{
      setLoading(false);
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
    const hasEmptyFields = tasks.some(
      (task) =>
        !task.activitiesPlanned.trim() ||  
        !task.estimatedTime
    );
  
    if (hasEmptyFields) {
      toast.error("tasks, Planned activities and estimated time are required!");
      return;
    }
  
    try {
      setSaving(true); 
  
      const formattedTasks = tasks.map((task) => ({
        taskData: {
          taskName: task.taskName,
          activitiesPlanned: task.activitiesPlanned,
          activitiesCompleted: task.activitiesCompleted || "",
          estimatedTime: Number(task.estimatedTime),
          actualTime: Number(task.actualTime) || 0,
          taskProgress: task.taskProgress || "PENDING",
        },
        ...(task.id && { taskId: task.id }), 
      }));
  
      await axios.post(
        `/api/dailyUpdates/${userId}/create`,
        { date, tasks: formattedTasks },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success("Daily updates saved successfully!");
      fetchDailyUpdates();
    } catch (error) {
      console.error("Error saving daily updates:", error);
      toast.error("Failed to save daily updates. Please try again.");
    } finally {
      setSaving(false); 
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

  if(loading){
    return <Loader />
  }

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
            <th className="border p-2">Action</th>
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
                    onChange={(e) => handleInputChange(index, "taskName", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={task.activitiesPlanned}
                    className="border w-full p-1"
                    onChange={(e) => handleInputChange(index, "activitiesPlanned", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={task.activitiesCompleted}
                    className="border w-full p-1"
                    onChange={(e) => handleInputChange(index, "activitiesCompleted", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={task.estimatedTime}
                    className="border w-full p-1"
                    onChange={(e) => handleInputChange(index, "estimatedTime", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={task.actualTime}
                    className="border w-full p-1"
                    onChange={(e) => handleInputChange(index, "actualTime", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <select
                    className="border w-full p-1"
                    value={task.taskProgress}
                    onChange={(e) => handleInputChange(index, "taskProgress", e.target.value)}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteTask(task.id, index)}
                    className="px-2 py-1 text-red-500 rounded-md hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
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
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={addNewTask} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Add Task
        </button>
        <button
          onClick={saveChanges}
          className={`px-4 py-2 rounded-md text-white ${
            saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
    // <div className="container mx-auto p-4">
    //   <h2 className="text-xl font-bold mb-4">Daily Updates - {date}</h2>

    //   <table className="w-full shadow-md rounded-lg border-collapse border border-gray-300">
    //     <thead>
    //       <tr className="bg-gray-200">
    //         <th className="border p-2">Task Name</th>
    //         <th className="border p-2">Planned Activities</th>
    //         <th className="border p-2">Completed Activities</th>
    //         <th className="border p-2">Estimated Time (hrs)</th>
    //         <th className="border p-2">Actual Time (hrs)</th>
    //         <th className="border p-2">Progress</th>
    //         {isEditable() && <th className="border p-2">Action</th>}
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {tasks.length > 0 ? (
    //         tasks.map((task, index) => (
    //           <tr key={index} className="text-center">
    //             <td className="border p-2">
    //               <input
    //                 type="text"
    //                 value={task.taskName}
    //                 className="border w-full p-1"
    //                 readOnly={!isEditable()}
    //                 onChange={(e) => handleInputChange(index, "taskName", e.target.value)}
    //               />
    //             </td>
    //             <td className="border p-2">
    //               <input
    //                 type="text"
    //                 value={task.activitiesPlanned}
    //                 className="border w-full p-1"
    //                 readOnly={!isEditable()}
    //                 onChange={(e) => handleInputChange(index, "activitiesPlanned", e.target.value)}
    //               />
    //             </td>
    //             <td className="border p-2">
    //               <input
    //                 type="text"
    //                 value={task.activitiesCompleted}
    //                 className="border w-full p-1"
    //                 readOnly={!isEditable()}
    //                 onChange={(e) => handleInputChange(index, "activitiesCompleted", e.target.value)}
    //               />
    //             </td>
    //             <td className="border p-2">
    //               <input
    //                 type="number"
    //                 value={task.estimatedTime}
    //                 className="border w-full p-1"
    //                 readOnly={!isEditable()}
    //                 onChange={(e) => handleInputChange(index, "estimatedTime", e.target.value)}
    //               />
    //             </td>
    //             <td className="border p-2">
    //               <input
    //                 type="number"
    //                 value={task.actualTime}
    //                 className="border w-full p-1"
    //                 readOnly={!isEditable()}
    //                 onChange={(e) => handleInputChange(index, "actualTime", e.target.value)}
    //               />
    //             </td>
    //             <td className="border p-2">
    //               <select
    //                 className="border w-full p-1"
    //                 value={task.taskProgress}
    //                 disabled={!isEditable()}
    //                 onChange={(e) => handleInputChange(index, "taskProgress", e.target.value)}
    //               >
    //                 <option value="PENDING">PENDING</option>
    //                 <option value="COMPLETED">COMPLETED</option>
    //               </select>
    //             </td>
    //             {isEditable() && (
    //               <td className="border p-2">
    //                 <button onClick={() => deleteTask(task.id, index)} className="px-2 py-1 text-red-500 rounded-md hover:text-red-600">
    //                   <FaTrash />
    //                 </button>
    //               </td>
    //             )}
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="7" className="border p-2 text-center">
    //             No tasks found
    //           </td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>
    //   {isEditable() && (
    //     <div className="mt-4 flex justify-end gap-2">
    //       <button onClick={addNewTask} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
    //         Add Task
    //       </button>
    //       <button onClick={saveChanges} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
    //         Save Changes
    //       </button>
    //     </div>
    //   )}
    // </div>
  );
};

export default InternUpdate;
