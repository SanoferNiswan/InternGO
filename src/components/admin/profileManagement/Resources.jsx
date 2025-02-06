import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import axios from "../../../api/axios";
import UserCard from "./UserCard";
import { useRef } from "react";

const Resources = () => {
  const { role, token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
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
  }, [search, filter, currentPage]);

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
          params: { limit: 8, offset: (currentPage - 1) * 8 },
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
    <div className="p-6 flex flex-wrap gap-4 justify-center items-center">
      {/* Search Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="mt-1 block w-3/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by name"
        />
      </div>

      {/* Filters Section */}
      {/* Year Filter */}
      <div className="mb-6">
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
      <div className="mb-6">
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
      <div className="mb-6">
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
      <div className="mb-6">
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
        {/* </div> */}
      </div>

      {users.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center ">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

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
        <p>No users found</p>
      )}
    </div>
  );
};

export default Resources;
