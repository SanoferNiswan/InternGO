import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "../../../api/axios.js"

const ScheduleModal = ({ onClose,refreshData }) => {
  const { token } = useSelector((state) => state.auth);
  const mentors = ["Arshad", "Gokul"];
  const [fields, setFields] = useState({
    interactionName: "",
    internName: "",
    internEmail: "",
    mentorName: mentors[0],
    interviewer: mentors[0],
    date: "",
    time: "",
    duration: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateFields = () => {
    let errors = {};
    if (!fields.interactionName)
      errors.interactionName = "Interaction Name is required";
    if (!fields.internName) errors.internName = "Intern Name is required";
    if (!fields.internEmail) {
      errors.internEmail = "Intern Email is required";
    } else if (!/\S+@\S+\.\S+/.test(fields.internEmail)) {
      errors.internEmail = "Invalid Email format";
    }
    if (!fields.date) errors.date = "Date is required";
    if (!fields.time) errors.time = "Time is required";
    if (!fields.duration) errors.duration = "Duration is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      console.log(fields.date,typeof fields.date);
      
      const response = await axios.post(
        "/api/interactions/schedule",
        {
          name: fields.interactionName,
          assignedIntern: fields.internName,
          internEmail: fields.internEmail,
          assignedMentor: fields.mentorName,
          assignedInterviewer: fields.interviewer,
          date: fields.date,
          time: formatTime(fields.time),
          duration: fields.duration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
 
      console.log(response.data.message);
      
      toast.success(response.data.message, {
        autoClose: 5000, 
        onClose: () => {
          onClose(),
          refreshData()
        } 
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to schedule interaction"
      ); // ✅ Toast error
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Schedule Interaction</h2>

        <div className="space-y-4">
          {[
            { name: "interactionName", label: "Interaction Name", type: "text" },
            { name: "internName", label: "Intern Name", type: "text" },
            { name: "internEmail", label: "Intern Email", type: "email" },
          ].map(({ name, label, type }) => (
            <div key={name} className="mb-3">
              <label className="block text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={fields[name]}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}

          <div className="mb-3">
            <label className="block text-gray-700">Mentor Name</label>
            <select
              name="mentorName"
              value={fields.mentorName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>Select a mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor} value={mentor}>
                  {mentor}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Interviewer</label>
            <select
              name="interviewer"
              value={fields.interviewer}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>Select an interviewer</option>
              {mentors.map((interviewer) => (
                <option key={interviewer} value={interviewer}>
                  {interviewer}
                </option>
              ))}
            </select>
          </div>
        </div>

        {
            [{ name: "date", label: "Date", type: "date" },
            { name: "time", label: "Time ( railway time only )", type: "time" },
            { name: "duration", label: "Duration", type: "text" }].map(({ name, label, type }) => (
                <div key={name} className="mb-3">
                  <label className="block text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={fields[name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded ${
              isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Scheduling..." : "Schedule"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
        </div>

        {/* 🔹 Add ToastContainer inside component */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ScheduleModal;