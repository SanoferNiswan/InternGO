import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import Select from "react-select";
 
const AdminUpdate = () => {
  const { date } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
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
            name: search,
            ...filter,
          },
          {
            params: { limit, offset: (currentPage - 1) * limit },
            headers: { Authorization: `Bearer ${token}` },
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

  //   return (
  //     <div className="p-4">
  //       <h2 className="text-2xl mb-2 font-bold text-blue-600">All Updates On {date}</h2>

  //       <input
  //         type="text"
  //         value={searchInput}
  //         onChange={(e) => setSearchInput(e.target.value)}
  //         className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full"
  //         placeholder="Search by name"
  //       />

  //       <div className="mt-4 grid grid-cols-3 gap-4">
  //         <Select
  //           isMulti
  //           value={createSelectOptions(filter.designation)}
  //           options={createSelectOptions(designations)}
  //           onChange={(selectedOptions) => handleFilterChange(selectedOptions, "designation")}
  //           placeholder="Filter by Designation"
  //         />
  //         <Select
  //           isMulti
  //           value={createSelectOptions(filter.year)}
  //           options={createSelectOptions(years)}
  //           onChange={(selectedOptions) => handleFilterChange(selectedOptions, "year")}
  //           placeholder="Filter by Year"
  //         />
  //         <Select
  //           isMulti
  //           value={createSelectOptions(filter.batch)}
  //           options={createSelectOptions(batches)}
  //           onChange={(selectedOptions) => handleFilterChange(selectedOptions, "batch")}
  //           placeholder="Filter by Batch"
  //         />
  //       </div>

  //       {loading ? (
  //         <p className="mt-4">Loading updates...</p>
  //       ) : (
  //         <div className="grid grid-cols-3 gap-4 mt-4">
  //           {dailyUpdates.length > 0 ? (
  //             dailyUpdates.map((update) => (
  //               <div key={update.id} className="bg-white p-4 shadow-md rounded-lg">
  //                 <h3 className="text-lg font-semibold text-blue-600">
  //                   {update.user.name} ({update.user.designation})
  //                 </h3>
  //                 <div className="mt-2">
  //                   {update.tasks.map((task) => (
  //                     <div key={task.id} className="border-t mt-2 pt-2">
  //                       <p className="font-medium text-gray-800">{task.taskName}</p>
  //                       <p className="text-sm text-gray-600">Planned: {task.activitiesPlanned || "N/A"}</p>
  //                       <p className="text-sm text-gray-600">Completed: {task.activitiesCompleted || "N/A"}</p>
  //                       <p className="text-sm text-gray-600">
  //                         Estimated: {task.estimatedTime || "-"} hrs, Actual: {task.actualTime || "-"} hrs
  //                       </p>
  //                       <p className="text-sm font-semibold text-blue-600">Progress: {task.taskProgress}</p>
  //                     </div>
  //                   ))}
  //                 </div>
  //               </div>
  //             ))
  //           ) : (
  //             <p className="col-span-3 text-center text-gray-500">No updates found.</p>
  //           )}
  //         </div>
  //       )}

  //       <div className="flex justify-center items-center mt-4 space-x-4">
  //         <button
  //           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  //           disabled={currentPage === 1}
  //           className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
  //         >
  //           Previous
  //         </button>
  //         <span>
  //           Page {currentPage} of {totalPages}
  //         </span>
  //         <button
  //           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
  //           disabled={currentPage === totalPages}
  //           className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
  //         >
  //           Next
  //         </button>
  //       </div>
  //     </div>
  //   );
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
         {date} Updates
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-60"
          placeholder="Search by name"
        />
        <Select
          isMulti
          value={createSelectOptions(filter.designation)}
          options={createSelectOptions(designations)}
          onChange={(selectedOptions) =>
            handleFilterChange(selectedOptions, "designation")
          }
          placeholder="Filter by Designation"
          className="w-60"
        />
        <Select
          isMulti
          value={createSelectOptions(filter.year)}
          options={createSelectOptions(years)}
          onChange={(selectedOptions) => handleFilterChange(selectedOptions, "year")}
          placeholder="Filter by Year"
          className="w-60"
        />
        <Select
          isMulti
          value={createSelectOptions(filter.batch)}
          options={createSelectOptions(batches)}
          onChange={(selectedOptions) => handleFilterChange(selectedOptions, "batch")}
          placeholder="Filter by Batch"
          className="w-60"
        />
      </div>

      {/* Tables by User */}
      {loading ? (
        <p className="text-center text-lg">Loading updates...</p>
      ) : dailyUpdates.length > 0 ? (
        dailyUpdates.map((update) => (
          <div key={update.user.id} className="mb-8">
            <h3 className="text-xl font-bold text-gray-700 mb-2 p-3 rounded-md">
              {update.user.name} - {update.user.designation}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 shadow-md">
                <thead>
                  <tr className="bg-gray-500 text-white text-left">
                    <th className="p-3 border">Task Name</th>
                    <th className="p-3 border">Planned Activities</th>
                    <th className="p-3 border">Completed Activities</th>
                    <th className="p-3 border">Estimated Time</th>
                    <th className="p-3 border">Actual Time</th>
                    <th className="p-3 border">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {update.tasks.map((task, index) => (
                    <tr
                      key={task.id}
                      className={
                        index % 2 === 0 ? "bg-white text-gray-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      <td className="p-3 border">{task.taskName}</td>
                      <td className="p-3 border">{task.activitiesPlanned || "N/A"}</td>
                      <td className="p-3 border">{task.activitiesCompleted || "N/A"}</td>
                      <td className="p-3 border">{task.estimatedTime || "-"} hrs</td>
                      <td className="p-3 border">{task.actualTime || "-"} hrs</td>
                      <td className="p-3 border font-semibold text-blue-600">{task.taskProgress}</td>
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
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 transition-all hover:bg-blue-700"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 transition-all hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUpdate;
