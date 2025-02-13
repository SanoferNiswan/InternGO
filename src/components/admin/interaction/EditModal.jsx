import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "../../../api/axios.js";

const EditModal = ({ onClose, interaction, refreshData }) => {
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

  useEffect(() => {
    if (interaction) { 
      setFields({
        interactionName: interaction.name || "",
        internName: interaction.assignedIntern || "",
        internEmail: interaction.internEmail || "",
        mentorName: interaction.assignedMentor || mentors[0],
        interviewer: interaction.assignedInterviewer || mentors[0],
        date: interaction.date ? interaction.date.split("T")[0] : "",
        time: interaction.time ? interaction.time.replace(/(AM|PM)/, "").trim() : "",
        duration: interaction.duration || "",
      });
    }
  }, [interaction]);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
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

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
        console.log("inside try");
        console.log(fields);
        
        
      const response = await axios.patch(
        `/api/interactions/${interaction.id}/update`,
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

      console.log(response);
      

      toast.success(response.data.message, {
        autoClose: 3000,
        onClose: () => {
          refreshData();
          onClose();
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update interaction"
      );
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
        <h2 className="text-xl font-semibold mb-4">Edit Interaction</h2>

        <div className="space-y-4">
          {["interactionName", "internName", "internEmail"].map((name) => (
            <input
              key={name}
              type="text"
              name={name}
              value={fields[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={name}
            />
          ))}

          <div className="mb-3">
            <label className="block text-gray-700">Mentor Name</label>
            <select
              name="mentorName"
              value={fields.mentorName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>
                Select a mentor
              </option>
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
              <option value="" disabled hidden>
                Select an interviewer
              </option>
              {mentors.map((interviewer) => (
                <option key={interviewer} value={interviewer}>
                  {interviewer}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {["date", "time", "duration"].map((name) => (
            <input
              key={name}
              type="text"
              name={name}
              value={fields[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={name}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default EditModal;
