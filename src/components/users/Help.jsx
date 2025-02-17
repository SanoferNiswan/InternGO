import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMentors } from "../../redux/slices/dataSlice";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const Help = () => {
  const {userId,token} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();
  const { mentors } = useSelector((state) => state.data);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "LOW",
    recepient: "Admins",
    recepientId: "",
  });

  useEffect(() => {
    dispatch(fetchMentors());
  }, [dispatch]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subject, description, recepientId,recepient } = formData;
    if (subject === "" || description === "" || recepientId === "" || recepient==="") {
      toast("error", "Please fill all details");
      return;
    }

    try {
      console.log(formData,":formdata");
      
      const response = await axios.post(`api/helpdesk/`, {
        userId,
        ...formData,
        resolvedStatus: "PENDING",
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log(response);
      
      if (response) {
        toast.success("Your request is submitted. Thank you!");
        setFormData({
          subject: "",
          description: "",
          priority: "LOW",
          recepient: "Admins",
          recepientId: "",
        });
      }
    } catch (err) {
      const msg =
        JSON.stringify(err?.response?.data?.message) ||
        "Help request not submitted";
        console.log(err);
        
      toast.error(msg);
    }
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
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
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
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recepient
            </label>
            <select
              value={formData.recepient}
              onChange={(e) => handleChange("recepient", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="Admins">Admin</option>
              <option value="Mentors">Mentor</option>
            </select>
          </div>

          {formData.recepient === "Mentors" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mentor
              </label>
              <select
                value={formData.recepientId}
                onChange={(e) => handleChange("recepientId", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select mentor</option>
                {mentors &&
                  mentors.map((mentor, index) => (
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

