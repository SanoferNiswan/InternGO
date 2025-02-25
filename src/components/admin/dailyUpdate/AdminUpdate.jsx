import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters } from "../../../redux/slices/dataSlice";
import { useParams, Navigate } from "react-router-dom";
import axios from "../../../api/axios";
import Select from "react-select";
import { addDays, isAfter, parseISO, isValid } from "date-fns";
import Loader from "../../Loader";

const AdminUpdate = () => {
  const { date } = useParams();

  const inputDate = parseISO(date);
  if (!isValid(inputDate)) {
    return <Navigate to="/not-found" replace />;
  }

  const today = new Date();
  const tomorrow = addDays(today, 1);

  if (isAfter(inputDate, tomorrow)) {
    return <Navigate to="/not-found" replace />;
  }

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const { token } = useSelector((state) => state.auth);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const [filter, setFilter] = useState({
    year: [],
    batch: [],
    designation: [],
    status: [],
  });

  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.data);

  useEffect(() => {
    if (token) {
      dispatch(fetchFilters());
    }
  }, [token]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const years = filters.years;
  const batches = filters.batches;
  const designations = filters.designations;

  useEffect(() => {
    const handler = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const createSelectOptions = useMemo(
    () => (options) =>
      options.map((option) => ({ value: option, label: option })),
    []
  );

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "/api/dailyUpdates/",
          {
            date,
            name: search.trim(),
            ...filter,
          },
          {
            params: { limit, offset: (currentPage - 1) * limit },
          }
        );

        if (response.data.statusCode === 200) {
          setDailyUpdates(response.data.data.data);
          setTotalPages(response.data.data.total_pages || 1);
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, [date, filter, search, currentPage]);

  const handleFilterChange = useCallback((selectedOptions, fieldName) => {
    setFilter((prev) => ({
      ...prev,
      [fieldName]: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }));
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
        Daily Updates ({formatDate(date)})
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md w-40 sm:w-48 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          placeholder="Search by name"
        />
        <Select
          isMulti
          value={createSelectOptions(filter.designation)}
          options={createSelectOptions(designations)}
          onChange={(selectedOptions) =>
            handleFilterChange(selectedOptions, "designation")
          }
          placeholder="Designation"
          className="w-40 sm:w-48 text-sm"
        />
        <Select
          isMulti
          value={createSelectOptions(filter.year)}
          options={createSelectOptions(years)}
          onChange={(selectedOptions) =>
            handleFilterChange(selectedOptions, "year")
          }
          placeholder="Year"
          className="w-40 sm:w-48 text-sm"
        />
        <Select
          isMulti
          value={createSelectOptions(filter.batch)}
          options={createSelectOptions(batches)}
          onChange={(selectedOptions) =>
            handleFilterChange(selectedOptions, "batch")
          }
          placeholder="Batch"
          className="w-40 sm:w-48 text-sm"
        />
      </div>

      {/* Table */}
      {dailyUpdates.length > 0 ? (
        dailyUpdates
          .filter((update) => update.tasks.length > 0)
          .map((update) => (
            <div key={update.user.id} className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2 p-2 rounded-md">
                {update.user.name}{" "}
                {update.user.designation ? `- ${update.user.designation}` : ""}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-blue-200 shadow-sm rounded-lg text-sm">
                  <thead>
                    <tr className="bg-blue-100 text-black">
                      <th className="p-2 border border-blue-200 w-1/6">
                        Task Name
                      </th>
                      <th className="p-2 border border-blue-200 w-1/6">
                        Planned Activities
                      </th>
                      <th className="p-2 border border-blue-200 w-1/6">
                        Completed Activities
                      </th>
                      <th className="p-2 border border-blue-200 w-1/6">
                        Estimated Time
                      </th>
                      <th className="p-2 border border-blue-200 w-1/6">
                        Actual Time
                      </th>
                      <th className="p-2 border border-blue-200 w-1/6">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {update.tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="text-gray-900 bg-white hover:bg-blue-50"
                      >
                        <td className="p-2 border border-blue-200 text-xs">
                          {task.taskName}
                        </td>
                        <td className="p-2 border border-blue-200 text-xs">
                          {task.activitiesPlanned || "N/A"}
                        </td>
                        <td className="p-2 border border-blue-200 text-xs">
                          {task.activitiesCompleted || "N/A"}
                        </td>
                        <td className="p-2 border border-blue-200 text-xs">
                          {task.estimatedTime
                            ? `${task.estimatedTime}hrs`
                            : "-"}
                        </td>
                        <td className="p-2 border border-blue-200 text-xs">
                          {task.actualTime ? `${task.actualTime}hrs` : "-"}
                        </td>
                        <td
                          className={`p-2 border border-blue-200 text-xs font-semibold ${
                            task.taskProgress === "PENDING"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {task.taskProgress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No updates found.</p>
      )}

      {/* Pagination */}
      {dailyUpdates.length > 0 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 text-sm hover:bg-blue-700"
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 text-sm hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUpdate;
