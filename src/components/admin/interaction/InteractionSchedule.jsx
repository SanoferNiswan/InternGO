import React, { useState, useEffect } from "react";
import ScheduleModal from "./ScheduleModal";
import { FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import Select from "react-select";
import axios from "../../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InteractionCard from "../../interaction/InteractionCard";
import EditModal from "./EditModal";
import Loader from "../../Loader";

const InteractionSchedule = () => {
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [filter, setFilter] = useState({
    year: [],
    batch: [],
    designation: [],
    interactionStatus: [],
  });

  const years = [2023, 2024, 2025];
  const status = ["PENDING", "COMPLETED"];
  const batches = ["Batch 1", "Batch 2", "Batch 3"];
  const designations = ["frontend", "backend", "testing"];

  const createSelectOptions = (options) =>
    options.map((option) => ({ value: option, label: option }));

  useEffect(() => {
    fetchData();
  }, [search, filter, currentPage, selectedDate]);

  const fetchData = async () => {
    try {
      console.log("inside fetch data");
      console.log("date:", selectedDate);

      console.log("Filter data : ", filter, "name : ", search);

      setLoading(true);
      const response = await axios.post(
        "/api/interactions/",
        {
          name: search,
          year: filter.year,
          batch: filter.batch,
          designation: filter.designation,
          interactionStatus: filter.interactionStatus,
          date: selectedDate,
        },
        {
          params: { limit: 9, offset: (currentPage - 1) * 9 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        console.log(response.data.data);
        setInteractions(response.data.data.data);
        setTotalPages(Math.ceil(response.data.data.total_pages));
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const handleFilterChange = (selectedOptions, filterType) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFilter({ ...filter, [filterType]: selectedValues });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setSelectedDate(formattedDate);
  };

  if(loading){
    return <Loader />
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 w-2/3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by name"
          />
          <Select
            isMulti
            value={filter.interactionStatus.map((status) => ({
              value: status,
              label: status,
            }))}
            options={createSelectOptions(status)}
            onChange={(selectedOptions) =>
              handleFilterChange(selectedOptions, "interactionStatus")
            }
            className="mt-1"
            placeholder="Select status"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-500 hover:underline"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl flex items-center gap-2"
        >
          <FaCalendarAlt className="text-lg" />
          Schedule Interaction
        </button>
      </div>

      {showFilters && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Year
            </label>
            <Select
              isMulti
              value={filter.year.map((year) => ({ value: year, label: year }))}
              options={createSelectOptions(years)}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "year")
              }
              className="mt-1"
              placeholder="Select Year"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Batch
            </label>
            <Select
              isMulti
              value={filter.batch.map((batch) => ({
                value: batch,
                label: batch,
              }))}
              options={createSelectOptions(batches)}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "batch")
              }
              className="mt-1"
              placeholder="Select Batch"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Designation
            </label>
            <Select
              isMulti
              value={filter.designation.map((designation) => ({
                value: designation,
                label: designation,
              }))}
              options={createSelectOptions(designations)}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "designation")
              }
              className="mt-1"
              placeholder="Select Designation"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholderText="Select Date"
            />
          </div>
        </div>
      )}

      {interactions.length === 0 && (
        <p className="font-semibold text-gray-600">No interactions found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interactions.map((interaction) => (
          <InteractionCard
            interaction={interaction}
            onEdit={() => setSelectedInteraction(interaction)}
          />
        ))}
      </div> 

      {selectedInteraction && (
        <EditModal
          interaction={selectedInteraction}
          onClose={() => setSelectedInteraction(null)} 
          refreshData={fetchData} 
        />
      )}

      <div className="flex justify-center gap-4 items-center mt-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <ScheduleModal
          onClose={() => setIsModalOpen(false)}
          refreshData={fetchData}
        />
      )}
    </div>
  );
};

export default InteractionSchedule;
