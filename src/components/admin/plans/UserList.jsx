import React, { useEffect, useState, useRef } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import Select from "react-select";
import { FaUserPlus, FaUser } from "react-icons/fa";
import Loader from "../../Loader";

const UserList = ({ planId }) => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading,setLoading] = useState(false);
  const limit = 5;
  const topRef = useRef();

  const [filter, setFilter] = useState({
    year: [],
    batch: [],
    designation: [],
    status: [],
    planStatus: "Present",
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
    fetchUsers();
  }, [planId, search, filter, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/plans/${planId}/users`,
        {
          name: search,
          year: filter.year,
          batch: filter.batch,
          designation: filter.designation, 
          status: filter.status,
          planStatus: filter.planStatus,
        },
        {
          params: { limit, offset: (currentPage - 1) * limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data.data.data)) {
        setUsers(response.data.data.data);
      } else {
        setUsers([]);
        console.error("Unexpected API response format:", response.data);
      }
      setTotalPages(response.data.data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleFilterChange = (selectedOptions, filterType) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFilter({ ...filter, [filterType]: selectedValues });
  };

  const handleSingleFilterChange = (selectedValue, filterType) => {
    setFilter({ ...filter, [filterType]: selectedValue });
    setSelectedUsers([]);
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

  const toggleUserSelection = (userId) => {
    setSelectedUsers(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) 
          : [...prevSelected, userId] 
    );
  };

  const handleAddOrRemoveUsers = async () => {
    if (selectedUsers.length === 0) return;

    const endpoint =
      filter.planStatus === "Present"
        ? `/api/plans/${planId}/removeUsers`
        : `/api/plans/${planId}/addUsers`;

    try {
      await axios.patch(
        endpoint,
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error updating users:", error);
    }
  };
 
  if(loading){
    return <Loader />
  }
  return (
    <div
      className="w-full p-4 bg-gray-100 rounded-lg shadow-md mt-6"
      ref={topRef}
    >
      <h2 className="text-lg font-semibold mb-4">Users Assigned to Plan</h2>

      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full"
        placeholder="Search by name"
      />

      <div className="flex space-x-4 mb-6 justify-center">
        <button
          onClick={() => handleSingleFilterChange("Present", "planStatus")}
          className={`p-1 text-white rounded-md ${
            filter.planStatus === "Present" ? "bg-blue-600" : "bg-blue-500"
          } flex items-center`}
        >
          <FaUser />
          <span>In plan</span>
        </button>

        <button
          onClick={() => handleSingleFilterChange("Not Present", "planStatus")}
          className={`p-1 text-white rounded-md ${
            filter.planStatus === "Not Present" ? "bg-blue-600" : "bg-blue-500"
          } flex items-center space-x-2`}
        >
          <FaUserPlus />
          <span>Add Interns</span>
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-blue-500 hover:underline"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        {showFilters && ( 
          <div className="mt-2 space-y-2">
            <Select
              isMulti
              value={createSelectOptions(filter.year)}
              options={createSelectOptions(years)}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "year")
              }
              placeholder="Filter by Year"
            />
            <Select
              isMulti
              value={createSelectOptions(filter.batch)}
              options={createSelectOptions(batches)}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "batch")
              }
              placeholder="Filter by Batch"
            />
            <Select
              isMulti
              value={createSelectOptions(filter.designation)}
              options={createSelectOptions(designations)}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "designation")
              }
              placeholder="Filter by Designation"
            />
            <Select
              isMulti
              value={createSelectOptions(filter.status)}
              options={createSelectOptions(statusOptions)}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "status")
              }
              placeholder="Filter by Status"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={`p-4 h-20 rounded-lg border cursor-pointer shadow-md w-full flex items-center ${
                selectedUsers.includes(user.id) ? "bg-green-100" : "bg-white"
              }`}
              onClick={() => toggleUserSelection(user.id)}
            >
              <div className="flex flex-col items-center justify-center w-1/4">
                <img
                  src={
                    user.profilePhoto ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  className="rounded-full bg-white h-12 w-12 mb-2"
                />
                <p className="font-extralight text-xs">{user.employeeId}</p>
              </div>

              <div className="ml-4 w-3/4">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="font-extralight text-xs">
                  {user.batch} - {user.year}
                </p>
                <p className="text-sm text-gray-500">{user.designation}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      {selectedUsers.length > 0 && (
        <button
          onClick={handleAddOrRemoveUsers}
          className="mt-4 px-2 py-1 bg-green-500 text-white rounded "
        >
          {filter.planStatus === "Present" ? "Remove Selected" : "Add Selected"}
        </button>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-xs">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
