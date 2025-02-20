import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilters } from "../../../redux/slices/dataSlice";
import Select from "react-select";
import axios from "../../../api/axios";
import UserCard from "./UserCard";
import Loader from "../../Loader";

const Resources = () => {
  const { role, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.data);

  useEffect(() => {
    if (token) {
      dispatch(fetchFilters());
    }
  }, [token]);

  const [users, setUsers] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [errors, setErrors] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const createSelectOptions = (options) =>
    options.map((option) => ({ value: option, label: option }));

  const [filter, setFilter] = useState({
    year: [],
    batch: [],
    designation: [],
    status: [],
  });

  useEffect(() => {
    fetchData();
  }, [search, filter, currentPage]);

  const fetchData = async () => {
    try {
      setLoadings(true);
      const response = await axios.post(
        "/api/users/",
        {
          name: search.trim(),
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
        console.log(response.data.data.data);

        setUsers(response.data.data.data);
        setTotalPages(Math.ceil(response.data.data.total_pages));
      }
    } catch (err) {
      setErrors("Failed to fetch data");
    } finally {
      setLoadings(false);
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

  if (loadings) {
    return <Loader />;
  }

  if (errors) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error: {errors}</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col flex-wrap gap-4 justify-center items-center">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-4">
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Filter by Year
          </label>
          <Select
            isMulti
            value={filter.year.map((year) => ({ value: year, label: year }))}
            options={createSelectOptions(filters.years)}
            onChange={(selectedOptions) =>
              handleFilterChange(selectedOptions, "year")
            }
            className="mt-1 block w-full"
            placeholder="Select Year"
          />
        </div>

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
            options={createSelectOptions(filters.batches)}
            onChange={(selectedOptions) =>
              handleFilterChange(selectedOptions, "batch")
            }
            className="mt-1 block w-full"
            placeholder="Select Batch"
          />
        </div>

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
            options={createSelectOptions(filters.designations)}
            onChange={(selectedOptions) =>
              handleFilterChange(selectedOptions, "designation")
            }
            className="mt-1 block w-full"
            placeholder="Select Designation"
          />
        </div>

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
            options={createSelectOptions(filters.statuses)}
            onChange={(selectedOptions) =>
              handleFilterChange(selectedOptions, "status")
            }
            className="mt-1 block w-full"
            placeholder="Select Status"
          />
        </div>
      </div>

      {users.length > 0 ? (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-between w-full">
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
            <span className="mt-2">
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
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg shadow-md h-[300px] w-[300px]">
          <p className="text-gray-500 text-lg font-semibold">
            🚀 No users found
          </p>
        </div>
      )}
    </div>
  );
};

export default Resources;
