import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";
import {
  parseISO,
  isValid,
  isAfter,
  addDays,
  isBefore,
  getDay,
} from "date-fns";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Loader";
import { decodeToken } from "../../../utils/auth";

const InternUpdate = () => {
  const { date } = useParams();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const joiningDate = new Date(2024, 12, 16);

  const inputDate = parseISO(date);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const today = new Date();
  const tomorrow = addDays(today, 1);

  if (
    isAfter(inputDate, tomorrow) ||
    isBefore(inputDate, joiningDate) ||
    !isValid(inputDate) ||
    getDay(inputDate) === 0 ||
    getDay(inputDate) === 6
  ) {
    return <Navigate to="/not-found" replace />;
  }

  const { token } = useSelector((state) => state.auth);
  const { userId } = decodeToken(token);

  const isEditable = (() => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    return date === today || date === tomorrowStr;
  })();

  const fetchDailyUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/dailyUpdates/${userId}?date=${date}`
      );
      setTotalTime(response.data.data.totalActualTime || 0);
      if (response.data.statusCode === 200) {
        setTasks(response.data.data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching daily updates:", error);
    } finally {
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
      {
        id: null,
        taskName: "",
        activitiesPlanned: "",
        activitiesCompleted: "",
        estimatedTime: "",
        actualTime: "",
        taskProgress: "PENDING",
      },
    ]);
  };

  const validateTasks = () => {
    let totalEstimatedTime = 0;
    let totalActualTime = 0;

    for (const task of tasks) {
      if (!task.taskName) {
        toast.error("Task Name is required");
        return false;
      }

      if (!task.activitiesPlanned) {
        toast.error("Planned Activities is required");
        return false;
      }

      if (!task.estimatedTime) {
        toast.error("Estimated Time is required for all tasks.");
        return false;
      }

      if (
        task.estimatedTime > 3 ||
        task.actualTime > 3 ||
        task.estimatedTime < 0.5 ||
        task.actualTime < 0.5
      ) {
        toast.error("time should between 0.5 to 3 hours for each task");
        return false;
      }

      const isValid = (str) =>
        !/^[0-9]+$/.test(str) &&
        !/^[^a-zA-Z0-9]+$/.test(str) &&
        str.trim().length >= 3;

      if (
        !isValid(task.taskName) ||
        !isValid(task.activitiesPlanned) ||
        (task.activitiesCompleted && !isValid(task.activitiesCompleted))
      ) {
        toast.error(
          "Task name and activities should be at least 3 characters long and not numeric"
        );
        return false;
      }

      totalEstimatedTime += Number(task.estimatedTime);
      totalActualTime += Number(task.actualTime || 0);
    }

    if (totalEstimatedTime > 10 || totalActualTime > 10) {
      toast.error("Total working hours should be less than 10");
      return false;
    }

    return true;
  };

  const saveChanges = async () => {
    if (!validateTasks()) {
      return;
    }

    try {
      setIsSubmitting(true);
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

      await axios.post(`/api/dailyUpdates/${userId}/create`, {
        date,
        tasks: formattedTasks,
      });
      fetchDailyUpdates();
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving daily updates:", error);
      toast.error(JSON.stringify(error.response?.data?.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTask = async (taskId, index) => {
    try {
      if (taskId) {
        await axios.delete(`/api/dailyUpdates/delete/${taskId}`);
      }
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const handlePaste = (e, startIndex, startField) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const rows = pasteData.split("\n");

    let currentIndex = startIndex;
    let currentField = startField;

    rows.forEach((row) => {
      const columns = row.split("\t");

      columns.forEach((value) => {
        if (currentIndex < tasks.length) {
          handleInputChange(currentIndex, currentField, value.trim());
          currentField = getNextField(currentField);
        }
      });

      currentIndex++;
      currentField = startField;
    });
  };

  const fields = [
    "taskName",
    "activitiesPlanned",
    "activitiesCompleted",
    "estimatedTime",
    "actualTime",
    "taskProgress",
  ];

  const getNextField = (currentField) => {
    const currentIndex = fields.indexOf(currentField);
    return fields[currentIndex + 1] || fields[0];
  };

  const handleKeyDown = (e, index, field) => {
    const input = e.target;
    const currentIndex = fields.indexOf(field);

    switch (e.key) {
      case "ArrowRight":
        if (currentIndex < fields.length - 1) {
          const nextField = fields[currentIndex + 1];
          const nextInput = input.parentElement.parentElement.querySelector(
            `input[name="${nextField}"], select[name="${nextField}"]`
          );
          nextInput?.focus();
        }
        break;
      case "ArrowLeft":
        if (currentIndex > 0) {
          const prevField = fields[currentIndex - 1];
          const prevInput = input.parentElement.parentElement.querySelector(
            `input[name="${prevField}"], select[name="${prevField}"]`
          );
          prevInput?.focus();
        }
        break;
      case "Enter":
        if (index < tasks.length - 1) {
          const nextRowInput =
            input.parentElement.parentElement.nextElementSibling?.querySelector(
              `input[name="${field}"], select[name="${field}"]`
            );
          nextRowInput?.focus();
        }
        break;

        // case "ArrowUp":
        //   if (index > 0) {
        //     const prevRowInput =
        //       input.parentElement.parentElement.previousElementSibling?.querySelector(
        //         `input[name="${field}"], select[name="${field}"]`
        //       );
        //     prevRowInput?.focus();
        //   }
        //   break;

        // case "ArrowDown":
        if (index < tasks.length - 1) {
          const nextRowInput =
            input.parentElement.parentElement.nextElementSibling?.querySelector(
              `input[name="${field}"], select[name="${field}"]`
            );
          nextRowInput?.focus();
        }
        break;

      default:
        break;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
        Daily Updates - ({formatDate(date)})
      </h2>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-blue-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-black text-left text-sm">
              <th className="p-2 border border-blue-200">Task Name</th>
              <th className="p-2 border border-blue-200">Planned Activities</th>
              <th className="p-2 border border-blue-200">
                Completed Activities
              </th>
              <th className="p-2 border border-blue-200">
                Estimated Time (hrs)
              </th>
              <th className="p-2 border border-blue-200">Actual Time (hrs)</th>
              <th className="p-2 border border-blue-200">Progress</th>
              {isEditable && (
                <th className="p-2 border border-blue-200">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr
                  key={index}
                  className="text-gray-900 text-sm bg-white hover:bg-blue-50 text-center"
                >
                  <td className="p-2 border border-blue-200">
                    <input
                      type="text"
                      name="taskName"
                      value={task.taskName}
                      className="w-full bg-transparent px-1 py-0.5 text-gray-700 focus:outline-none hover:border-blue-500 focus:border-b-2 border-transparent"
                      readOnly={!isEditable}
                      onChange={(e) =>
                        handleInputChange(index, "taskName", e.target.value)
                      }
                      onPaste={(e) => handlePaste(e, index, "taskName")}
                      onKeyDown={(e) => handleKeyDown(e, index, "taskName")}
                    />
                  </td>
                  <td className="p-2 border border-blue-200">
                    <input
                      type="text"
                      name="activitiesPlanned"
                      value={task.activitiesPlanned}
                      className="w-full bg-transparent px-1 py-0.5 text-gray-700 focus:outline-none hover:border-blue-500 focus:border-b-2 border-transparent"
                      readOnly={!isEditable}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "activitiesPlanned",
                          e.target.value
                        )
                      }
                      onPaste={(e) =>
                        handlePaste(e, index, "activitiesPlanned")
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, "activitiesPlanned")
                      }
                    />
                  </td>
                  <td className="p-2 border border-blue-200">
                    <input
                      type="text"
                      name="activitiesCompleted"
                      value={task.activitiesCompleted}
                      className="w-full bg-transparent px-1 py-0.5 text-gray-700 focus:outline-none hover:border-blue-500 focus:border-b-2 border-transparent"
                      readOnly={!isEditable}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "activitiesCompleted",
                          e.target.value
                        )
                      }
                      onPaste={(e) =>
                        handlePaste(e, index, "activitiesCompleted")
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, "activitiesCompleted")
                      }
                    />
                  </td>
                  <td className="p-2 border border-blue-200">
                    <input
                      type="number"
                      name="estimatedTime"
                      value={task.estimatedTime}
                      className="w-full bg-transparent px-1 py-0.5 text-gray-700 focus:outline-none hover:border-blue-500 focus:border-b-2 border-transparent"
                      readOnly={!isEditable}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "estimatedTime",
                          e.target.value
                        )
                      }
                      onPaste={(e) => handlePaste(e, index, "estimatedTime")}
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, "estimatedTime")
                      }
                    />
                  </td>
                  <td className="p-2 border border-blue-200">
                    <input
                      type="number"
                      name="actualTime"
                      value={task.actualTime}
                      className="w-full bg-transparent px-1 py-0.5 text-gray-700 focus:outline-none hover:border-blue-500 focus:border-b-2 border-transparent"
                      readOnly={!isEditable}
                      onChange={(e) =>
                        handleInputChange(index, "actualTime", e.target.value)
                      }
                      min={0.5}
                      max={3}
                      step={0.1}
                      onPaste={(e) => handlePaste(e, index, "actualTime")}
                      onKeyDown={(e) => handleKeyDown(e, index, "actualTime")}
                    />
                  </td>
                  <td
                    className={`p-2 border border-blue-200 font-semibold ${
                      task.taskProgress === "PENDING"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    <select
                      name="taskProgress"
                      className="w-full bg-transparent px-2 py-1 text-gray-700 focus:outline-none hover:border-blue-500 focus:border-b-2 border-transparent"
                      value={task.taskProgress}
                      disabled={!isEditable}
                      onChange={(e) =>
                        handleInputChange(index, "taskProgress", e.target.value)
                      }
                      min={0.5}
                      max={3}
                      step={0.1}
                      onKeyDown={(e) => handleKeyDown(e, index, "taskProgress")}
                      style={{
                        width: "100%",
                        minWidth: "150px",
                        paddingRight: "1rem",
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  {isEditable && (
                    <td className="p-2 border border-blue-200">
                      <button
                        onClick={() => deleteTask(task.id, index)}
                        className="px-2 py-1 text-red-500 rounded-md hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-2 border border-blue-200 text-center text-gray-600 font-semibold"
                >
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 rounded-md">
        <div className="text-blue-400 w-[200px] bg-white border-2 border-blue-300 p-2 hover:bg-blue-50 text-center font-semibold">
          Total Time: {totalTime} Hours
        </div>

        {isEditable && (
          <div className="flex gap-2">
            <button
              onClick={addNewTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add Task
            </button>
            <button
              onClick={saveChanges}
              className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternUpdate;
