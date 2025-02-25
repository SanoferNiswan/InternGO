import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import InteractionCard from "../../interaction/InteractionCard";
import Loader from "../../Loader";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/auth";

const UserInteraction = () => {
  const { token,name } = useSelector((state) => state.auth);
  const {userId}=decodeToken(token);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interactionStatus, setInteractionStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const statusOptions = ["PENDING", "COMPLETED", "FEEDBACK_PENDING"];

  const handleFilterChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setInteractionStatus(selectedValues);
  };

  useEffect(() => {
    fetchData();
  }, [interactionStatus,selectedDate]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `/api/interactions/${userId}`,
        { interactionStatus,date:selectedDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInteractions(response.data.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setSelectedDate(formattedDate);
  };

  const createSelectOptions = (options) =>
    options.map((option) => ({ value: option, label: option }));

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-2">
      <h1 className="mb-6 text-2xl font-semibold text-center text-blue-500">
        {name}'s Interaction
      </h1>
      <div className="flex gap-4 px-6">
        <div>
          <Select
            isMulti
            value={interactionStatus.map((status) => ({
              value: status,
              label: status,
            }))}
            options={createSelectOptions(statusOptions)}
            onChange={handleFilterChange}
            className="w-full"
            placeholder="Select Status"
          />
        </div>
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none sm:text-sm"
            placeholderText="Select Date"
          />
        </div>
      </div>
      {interactions.length === 0 && (
        <p className="font-semibold text-gray-600 text-center p-3 rounded-md h-96 flex justify-center items-center">
          No interactions found
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {interactions &&
          interactions.map((interaction) => (
            <InteractionCard key={interaction.id} interaction={interaction} />
          ))}
      </div>
    </div>
  );
};

export default UserInteraction;