import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters } from "../../../redux/slices/dataSlice";
import Select from "react-select";
import axios from "../../../api/axios";
import Loader from "../../Loader";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const { role, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showfilters, setShowfilters] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.data);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  useEffect(() => {
    dispatch(fetchFilters());
  }, [token]);

  const [filter, setFilter] = useState({
    year: [],
    batch: [],
    designation: [],
    status: [],
    zone: [],
  });

  const years = filters.years;
  const batches = filters.batches;
  const designations = filters.designations;
  const statusOptions = filters.statuses;
  const zoneOptions = ["GREEN ZONE", "RED ZONE", "YELLOW ZONE"];

  const createSelectOptions = (options) =>
    options.map((option) => ({ value: option, label: option }));

  useEffect(() => {
    fetchData();
  }, [search, filter, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/users/",
        {
          name: search.trim(),
          year: filter.year,
          batch: filter.batch,
          designation: filter.designation,
          status: filter.status,
          zone: filter.zone,
        },
        {
          params: { limit: 10, offset: (currentPage - 1) * 10 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setUsers(response.data.data.data);
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
    }, 1000);

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

  if (role !== "Admins") {
    return (
      <div className="p-6">
        <p className="text-center text-red-600 text-lg font-semibold">
          You are restricted from accessing this page.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-2 justify-start">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full sm:w-[500px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-500 outline-none sm:text-sm"
            placeholder="Search by name"
          />
        </div>

        <div
          onClick={() => setShowfilters(!showfilters)}
          className="w-full sm:w-auto text-center cursor-pointer border border-blue-400 rounded-md px-2 py-1 text-blue-500 text-sm bg-transparent hover:bg-blue-500 hover:text-white"
        >
          {showfilters ? "Hide Filters " : "Show Filters"}
          {showfilters ? "▲" : "▼"}
        </div>
      </div>

      {showfilters && (
        <div className="p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Select
                isMulti
                value={filter.year.map((year) => ({
                  value: year,
                  label: year,
                }))}
                options={createSelectOptions(years)}
                onChange={(selectedOptions) =>
                  handleFilterChange(selectedOptions, "year")
                }
                className="w-full"
                placeholder="Select Year"
              />
            </div>

            <div>
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
                className="w-full"
                placeholder="Select Batch"
              />
            </div>

            <div>
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
                className="w-full"
                placeholder="Select Designation"
              />
            </div>

            <div>
              <Select
                isMulti
                value={filter.status.map((status) => ({
                  value: status,
                  label: status,
                }))}
                options={createSelectOptions(statusOptions)}
                onChange={(selectedOptions) =>
                  handleFilterChange(selectedOptions, "status")
                }
                className="w-full"
                placeholder="Select Status"
              />
            </div>

            <div>
              <Select
                isMulti
                value={filter.zone.map((status) => ({
                  value: status,
                  label: status,
                }))}
                options={createSelectOptions(zoneOptions)}
                onChange={(selectedOptions) =>
                  handleFilterChange(selectedOptions, "zone")
                }
                className="w-full"
                placeholder="Select zone"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Emp ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Zone
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-100 transition-colors "
                  onClick={() => navigate(`/admin/feedback/user/${user.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <img
                      src={
                        user.profilePhoto ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="profile"
                      className="w-16 h-16 rounded-full object-cover mt-3 mb-3 border-2 border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.employeeId || "Not Provided"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.year || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.batch || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.designation || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        ["SHADOWING", "DEPLOYED", "ACTIVE"].includes(
                          user.status
                        )
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status || "Not Updated"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.plan?.name || "No Plan"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-semibold ${
                        user.zone === "GREEN ZONE"
                          ? "text-green-500"
                          : user.zone === "RED ZONE"
                          ? "text-red-500"
                          : user.zone === "YELLOW ZONE"
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                    >
                      {user.zone || "No Zone"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 bg-blue-50">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;