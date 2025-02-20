import React, { useState, useEffect } from "react";
import ScheduleModal from "./ScheduleModal";
import { FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters } from "../../../redux/slices/dataSlice";
import Select from "react-select";
import axios from "../../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InteractionCard from "../../interaction/InteractionCard";
import EditModal from "./EditModal";
import Loader from "../../Loader";

const InteractionSchedule = () => {
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { filters } = useSelector(
    (state) => state.data
  ); 



  useEffect(()=>{
    if(token){
      dispatch(fetchFilters());
    }
  },[token])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const [filter, setFilter] = useState({
    year: [],
    batch: [],
    designation: [],
    interactionStatus: [],
  });

  const years = filters.years;
  const status = ["PENDING", "COMPLETED"];
  const batches = filters.batches;
  const designations = filters.designations;

  const createSelectOptions = (options) =>
    options.map((option) => ({ value: option, label: option }));

  useEffect(() => {
    fetchData();
  }, [search, filter, currentPage, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/interactions/",
        {
          name: search.trim(),
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-2/3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="w-full sm:w-auto"
              placeholder="Select status"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-blue-500 hover:underline"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

        {/* Schedule Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl flex items-center gap-2"
        >
          <FaCalendarAlt className="text-lg" />
          Schedule Interaction
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
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
          <div>
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
          <div>
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
          <div>
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

      {interactions.length === 0 ? (
        <p className="font-semibold text-gray-600 text-center bg-gray-100 p-3 rounded-md shadow-md h-96 flex justify-center items-center">
          No interactions found
        </p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interactions.map((interaction) => (
              <InteractionCard
                interaction={interaction}
                onEdit={() => setSelectedInteraction(interaction)}
              />
            ))}
          </div>
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
        </div>
      )}

      {selectedInteraction && (
        <EditModal
          interaction={selectedInteraction}
          onClose={() => setSelectedInteraction(null)}
          refreshData={fetchData}
        />
      )}

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
