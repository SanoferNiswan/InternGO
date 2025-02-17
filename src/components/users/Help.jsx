import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMentors } from "../../redux/slices/dataSlice";

const Help = () => {
  const dispatch = useDispatch();
  const { mentors } = useSelector((state) => state.data);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [recipient, setRecipient] = useState("admin"); 
  const [mentor, setMentor] = useState("");

  console.log("mentors :", mentors);

  useEffect(() => {
    dispatch(fetchMentors());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      subject,
      description,
      priority,
      recipient,
      recipientName,
    };

    // Send formData to the server or handle it accordingly
    console.log(formData);
  };

  return (
    <div className="p-6">
      
      <div className="flex flex-col justify-center items-center">
      <h1 className="text-xl font-semibold mb-8">Help Page</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-[500px]">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter subject"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recipient
          </label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="Admins">Admin</option>
            <option value="Mentors">Mentor</option>
          </select>
        </div>

        {recipient === "Mentors" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mentor
            </label>
            <select
              value={mentor}
              onChange={(e) => setMentor(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm z-10"
              required
            >
              <option value="">Select mentor</option>
              {mentors &&
                mentors.map((mentor,index) => (
                  <option key={index} value={mentor}>
                    {mentor}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Help;
