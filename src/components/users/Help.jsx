import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMentors } from "../../redux/slices/dataSlice";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import Loader from "../Loader";

const Help = () => {
  const { userId, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { mentors } = useSelector((state) => state.data);
  const [loading, setLoading] = useState();
  const [help, setHelp] = useState([]);
  const [activeTab,setActiveTab] = useState("new");

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "LOW",
    recepient: "Admins",
    recepientId: "",
  });

  useEffect(() => {
    fetchHelp();
  }, [token]);

  const fetchHelp = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/helpdesk/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHelp(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      toast.error(JSON.stringify(error.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

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

    const { subject, description, recepient } = formData;
    if (subject === "" || description === "" || recepient === "") {
      toast("error", "Please fill all details");
      return;
    }
    let newFormData = { ...formData };

    if (recepient === "Admins") {
      var { recepientId, ...rest } = formData;
      newFormData = rest;
    }

    try {
      const response = await axios.post(
        `api/helpdesk/`,
        {
          userId,
          ...newFormData,
          resolvedStatus: "PENDING",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Help Page</h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-6 py-2 rounded-md transition duration-200 ${
              activeTab === "new"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            New Help Request
          </button>
          <button
            onClick={() => setActiveTab("your")}
            className={`px-6 py-2 rounded-md transition duration-200 ${
              activeTab === "your"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Your Help Requests
          </button>
        </div>

        {activeTab === "new" && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-lg bg-white p-6 rounded-lg shadow-md transition-opacity duration-300"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter description"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient
              </label>
              <select
                value={formData.recepient}
                onChange={(e) => handleChange("recepient", e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="Admins">Admin</option>
                <option value="Mentors">Mentor</option>
              </select>
            </div>

            {formData.recepient === "Mentors" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mentor
                </label>
                <select
                  value={formData.recepientId}
                  onChange={(e) => handleChange("recepientId", e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Your Help Requests Tab */}
        {activeTab === "your" && (
          <div className="w-[500px] max-w-4xl bg-white p-6 rounded-lg shadow-md transition-opacity duration-300">
            {help.length > 0 ? (
              <div className="space-y-4">
                {help.map((h, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-100 m-2 flex justify-between items-start hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Subject: {h.subject}
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">
                        Description: {h.description}
                      </p>
                      <span className="text-xs font-medium text-gray-500">
                        Recipient: {h.recepient}
                      </span>
                    </div>

                    <div className="flex flex-col items-end h-full justify-between gap-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          h.resolvedStatus === "PENDING"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {h.resolvedStatus === "PENDING"
                          ? "Pending"
                          : "Resolved"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold text-blue-600`}
                      >
                        Priority: {h.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-40 bg-gray-100 rounded-md shadow-md text-gray-600 text-lg font-semibold">
                No help requests found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
