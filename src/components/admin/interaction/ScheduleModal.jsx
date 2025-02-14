import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMentors } from "../../../redux/slices/dataSlice";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";

const ScheduleModal = ({ onClose, refreshData }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { mentors } = useSelector(
    (state) => state.data
  ); 
 
  useEffect(() => {
    if (mentors.length === 0) {
      dispatch(fetchMentors());
    }
  }, [token, dispatch]);

  const [fields, setFields] = useState({
    interactionName: "",
    internName: "",
    internEmail: "",
    mentorName: "",
    interviewer: "",
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
      console.log((fields.time));
      
      const response = await axios.post(
        "/api/interactions/schedule",
        {
          name: fields.interactionName,
          assignedIntern: fields.internName,
          internEmail: fields.internEmail,
          assignedMentor: fields.mentorName,
          assignedInterviewer: fields.interviewer,
          date: fields.date,
          time: fields.time,
          duration: fields.duration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message, {
        autoClose: 5000,
        onClose: () => {
          onClose(), refreshData();
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to schedule interaction"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Schedule Interaction</h2>

        <div className="space-y-4">
          {[
            {
              name: "interactionName",
              label: "Interaction Name",
              type: "text",
            },
            { name: "internName", label: "Intern Name", type: "text" },
            { name: "internEmail", label: "Intern Email", type: "email" },
          ].map(({ name, label, type }) => (
            <div key={name} className="mb-3 flex flex-col gap-y-2">
              <label className="block text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={fields[name]}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors[name] && (
                <p className="text-red-500 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="mb-3 flex flex-col gap-y-2">
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

          <div className="mb-3 flex flex-col gap-y-2">
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

        <div className="mb-3 flex flex-col gap-y-2">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={fields["date"]}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors["date"] && (
              <p className="text-red-500 text-sm">{errors["date"]}</p>
            )}
          </div>

          <div className="mb-3 flex flex-col gap-y-2">
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={fields["time"]}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors["time"] && (
              <p className="text-red-500 text-sm">{errors["time"]}</p>
            )}
          </div>

          <div className="mb-3 flex flex-col gap-y-2">
            <label className="block text-gray-700">Duration</label>
            <input
              type="duration"
              name="duration"
              value={fields["duration"]}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors["duration"] && (
              <p className="text-red-500 text-sm">{errors["duration"]}</p>
            )}
          </div>


        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
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

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ScheduleModal;
