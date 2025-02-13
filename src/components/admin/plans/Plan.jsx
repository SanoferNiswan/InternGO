import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";
import { FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Loader";

const Plan = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [planDays, setPlanDays] = useState("");
  const [plans, setPlans] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("/api/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(response.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Unauthorized access");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(planDays) > 180) {
      toast.error("Plan days must be less than 180!");
      return;
    }

    const planDetails = {
      name: planName,
      description: description,
      planDays: parseInt(planDays),
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/plans/create", planDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        const data = response.data.data;
        toast.success("Plan created successfully!");
        setPlans((prev) => [...prev, data]);

        // Clear the form
        setPlanName("");
        setPlanDays("");
        setDescription("");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create plan");
      }
    } catch (error) {
      console.error("Error submitting plan:", error);
      toast.error("Error creating plan");
    }finally{
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Dynamic Plan Cards */}
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="relative flex flex-col bg-white shadow-md p-5 rounded-xl cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 min-h-[180px]"
          onClick={() => navigate(`/admin/plans/${plan.id}`)}
        >
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaClipboardList className="text-blue-500 mr-2 text-xl" />{" "}
            {plan.name}
          </h2>
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">
            {plan.description}
          </p>
          <p className="text-gray-700 font-medium mt-auto flex items-center text-sm">
            <FaCalendarAlt className="text-green-500 mr-2" />
            {plan.planDays} Days
          </p>
        </div>
      ))}

      {/* Add New Plan Button */}
      <div
        className="relative flex flex-col bg-white shadow-md p-6 rounded-xl cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 items-center justify-center min-h-[180px]"
        onClick={() => setIsModalOpen(true)}
      >
        <p className="text-center text-4xl text-gray-500">+</p>
        <p className="mt-1 font-bold text-gray-500">Create Plan</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Create New Plan
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-900 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Days
                </label>
                <input
                  type="number"
                  value={planDays}
                  onChange={(e) => setPlanDays(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {parseInt(planDays) > 180 && (
                  <p className="text-red-500 text-sm mt-1">
                    Plan days must be less than 180!
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md text-sm transition 
    ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                  disabled={isSubmitting} 
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel 
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plan;
