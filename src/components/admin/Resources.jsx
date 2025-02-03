import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "../../api/axios";

const Resources = () => {
  const navigate = useNavigate();
  const { role, token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState({
    year: [],
    batch: [],
    designation: [],
    status: [],
  });

  const years = [2023, 2024, 2025];
  const batches = ["Batch 1", "Batch 2", "Batch 3"];
  const designations = ["frontend", "backend", "testing"];
  const statusOptions = [
    "ACTIVE",
    "NOT_ACTIVE",
    "EXAMINATION",
    "SHADOWING",
    "DEPLOYED",
  ];

  const createSelectOptions = (options) =>
    options.map((option) => ({ value: option, label: option }));

  useEffect(() => {
    fetchData();
  }, [currentPage, filter, search]);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleDebounce = useCallback(
    debounce((text) => {
      handleSearch(text);
    }, 15000),
    []
  );

  const handleSearch = (text) => {
    setSearch(text);
    handleDebounce(text);
  };

  const handleFilterChange = (selectedOptions, filterType) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFilter({ ...filter, [filterType]: selectedValues });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/users/",
        {
          name: search,
          year: filter.year,
          batch: filter.batch,
          designation: filter.designation,
          status: filter.status,
        },
        {
          params: {
            limit: 6,
            offset: (currentPage - 1) * 6,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        const dt = response.data.data;
        setUsers(dt.data);
        setTotalPages(Math.ceil(dt.total_pages));
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handler
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="mt-1 block w-3/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by name"
        />
      </div>

      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {/* Year Filter */}
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
            className="mt-1 block w-full"
            placeholder="Select Year"
          />
        </div>

        {/* Batch Filter */}
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
            className="mt-1 block w-full"
            placeholder="Select Batch"
          />
        </div>

        {/* Designation Filter */}
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
            className="mt-1 block w-full"
            placeholder="Select Designation"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
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
            className="mt-1 block w-full"
            placeholder="Select Status"
          />
        </div>
      </div>

      {users.length > 0 ? (
        <div>
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="relative flex bg-white shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => navigate(`/dashboard/resources/${user.id}`)}
              >
                <div
                  className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
                    (user.status === "SHADOWING" || user.status==="DEPLOYED" || user.status==="ACTIVE")
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {user.status || "not updated"}
                </div>

                {/* Card Content */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center w-1/2">
                    <img
                      src={
                        user.profilePhoto ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="profile"
                      className="w-28 h-28 rounded-full object-cover mb-4"
                    />
                    <p className="text-sm text-gray-500 font-semibold">
                      Emp ID: {user.employeeId || "not provided"}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center w-1/2 mt-4">
                    <p className="text-lg font-bold">{user.name || "---"}</p>
                    <p className="text-sm text-gray-500">
                      Phone: {user.phone_no || "---"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {user.year || "---"} - {user.batch || "---"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {user.phase || "---"}
                    </p>
                    <p className="mt-2 text-blue-600 font-semibold">
                      {user.designation || "---"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
};

export default Resources;
