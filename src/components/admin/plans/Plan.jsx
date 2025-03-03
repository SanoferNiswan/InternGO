import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Loader";

const Plan = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [planDays, setPlanDays] = useState("");
  const [plans, setPlans] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("/api/plans");

      setPlans(response.data.data);
    } catch (error) {
      toast.error(JSON.stringify(error.response?.data?.message));
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
      startDate: startDate || "",
      endDate: endDate || "",
    };

    try {
      setIsSubmitting(true);
      console.log(planDetails);
      
      const response = await axios.post("/api/plans/create", planDetails);

      if (response.status === 201) {
        const data = response.data.data;
        toast.success("Plan created successfully!");
        setPlans((prev) => [...prev, data]);

        setPlanName("");
        setPlanDays("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create plan");
      }
    } catch (error) {
      toast.error(JSON.stringify(error.response?.data?.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (planDays && planDays <= 180 && newStartDate) {
      const calculatedEndDate = new Date(newStartDate);
      calculatedEndDate.setDate(
        calculatedEndDate.getDate() + parseInt(planDays)
      );
      setEndDate(calculatedEndDate.toISOString().split("T")[0]);
    } else {
      setEndDate("");
    }
  };

  const handlePlanDaysChange = (e) => {
    const days = e.target.value;

    if (days === "") {
      setPlanDays("");
      return;
    }

    if (days > 180 || days < 1) {
      toast.error("plandays must between 1 to 180");
      return;
    }
    setPlanDays(days);

    if (startDate && days) {
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + parseInt(days));
      setEndDate(calculatedEndDate.toISOString().split("T")[0]);
    } else {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = new Date(e.target.value);
    const minAllowedEndDate = new Date(startDate);
    minAllowedEndDate.setDate(minAllowedEndDate.getDate() + parseInt(planDays));

    if (selectedEndDate >= minAllowedEndDate) {
      setEndDate(e.target.value);
    } else {
      toast.error(
        `End date must be at least ${
          minAllowedEndDate.toISOString().split("T")[0]
        }`
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="relative flex flex-col bg-white shadow-md p-5 rounded-xl cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 min-h-[200px]"
          onClick={() => navigate(`/admin/plans/${plan.id}`)}
        >
          <h2 className="text-lg font-semibold text-gray-800 flex items-center line-clamp-1">
            <FaClipboardList className="text-blue-500 mr-2 text-xl" />{" "}
            {plan.name}
          </h2>
          <p className="text-gray-600 mt-2 text-sm line-clamp-4">
            {plan.description}
          </p>
          <p className="text-gray-700 font-medium mt-auto flex items-center text-sm">
            <FaCalendarAlt className="text-green-500 mr-2" />
            {plan.planDays} Days
          </p>

          <p className="absolute bottom-2 right-2 mb-3 text-xs text-gray-500">
            {plan.startDate && new Date(plan.startDate).toLocaleDateString()} -{" "}
            {plan.endDate && new Date(plan.endDate).toLocaleDateString()}
          </p>
        </div>
      ))}

      <div
        className="relative flex flex-col bg-white shadow-md p-6 rounded-xl cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 items-center justify-center min-h-[200px]"
        onClick={() => setIsModalOpen(true)}
      >
        <p className="text-center text-4xl text-gray-500">+</p>
        <p className="mt-1 font-bold text-gray-500">Create Plan</p>
      </div>

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
              {["Plan Name", "Description", "Number of Days", "Start Date"].map(
                (label, index) => (
                  <div key={index} className="relative mb-4">
                    {label === "Description" ? (
                      <textarea
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={3}
                      />
                    ) : (
                      <input
                        type={
                          label.includes("Date")
                            ? "date"
                            : label === "Number of Days"
                            ? "number"
                            : "text"
                        }
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        value={
                          {
                            "Plan Name": planName,
                            "Number of Days": planDays,
                            "Start Date": startDate,
                          }[label] || ""
                        }
                        onChange={
                          {
                            "Plan Name": (e) => setPlanName(e.target.value),
                            "Number of Days": handlePlanDaysChange,
                            "Start Date": handleStartDateChange,
                          }[label]
                        }
                        min={
                          label.includes("Date")
                            ? new Date().toISOString().split("T")[0]
                            : undefined
                        } 
                        required
                      />
                    )}
                    <label className="absolute text-md text-gray-500 top-2 bg-white px-2 ml-2 scale-75 -translate-y-4 peer-focus:text-blue-600">
                      {label}
                    </label>
                  </div>
                )
              )}

              {planDays && startDate && (
                <div className="relative mb-4">
                  <input
                    type="date"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    value={endDate}
                    onChange={handleEndDateChange}
                    required
                  />
                  <label className="absolute text-md text-gray-500 top-2 bg-white px-2 ml-2 scale-75 -translate-y-4 peer-focus:text-blue-600">
                    End date
                  </label>
                </div>
              )}

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