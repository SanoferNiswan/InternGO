import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const Resources = () => {
  const navigate = useNavigate();
  const { role, token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');

  useEffect(() => {
        fetchData();
  }, [currentPage, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users?limit=6&offset=${(currentPage - 1) * 6}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
      });
      setUsers(response.data.data.data);
      console.log(response.data.data.data);
      
      setTotalPages(Math.floor(response.data.data.total_pages)); 
    } catch (err) {
      console.log(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      (!nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!statusFilter || user.status === statusFilter) &&
      (!designationFilter || user.designation === designationFilter) &&
      (!batchFilter || user.batch.includes(batchFilter)) &&
      (!phaseFilter || user.phase === phaseFilter)
    );
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (role !== 'Admins') {
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

  if(totalPages<1){
    return <div>
      OOPS!! No resources found
    </div>
  }

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Name</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter name"
          />
        </div> 

        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="SHADOWING">SHADOWING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="NOT_ACTIVE">NOT_ACTIVE</option>
            <option value="EXAMINATION">EXAMINATION</option>
            <option value="DEPLOYED">DEPLOYED</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Designation</label>
          <select
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="backend">Backend Developer</option>
            <option value="frontend">Frontend Developer</option>
            <option value="tester">Tester</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Year</label>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {batchFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Batch</label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="Batch 1">Batch 1</option>
              <option value="Batch 2">Batch 2</option>
              <option value="Batch 3">Batch 3</option>
            </select>
          </div>
        )}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="relative flex bg-white shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/dashboard/resources/${user.id}`)}
          >
            <div
              className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
                user.status === 'SHADOWING' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
              }`}
            >
              {user.status || "not updated"}
            </div>

            {/* Card Content */}
            <div className="flex gap-4">
              {/* Left Section: Profile Picture and Employee ID */}
              <div className="flex flex-col items-center w-1/2">
                <img
                  src={
                    user.profilePhoto ||
                    'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='
                  }
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover mb-4"
                />
                <p className="text-sm text-gray-500 font-semibold">Emp ID: {user.employeeId || "not provided" }</p>
              </div>

              {/* Right Section: User Details */}
              <div className="flex flex-col justify-center w-1/2 mt-4">
                <p className="text-lg font-bold">{user.name || "---"}</p>
                <p className="text-sm text-gray-500">Phone: {user.phone_no || "---"}</p>
                <p className="text-sm text-gray-700">{user.year || "---"} -  {user.batch || "---" }</p>
                <p className="text-sm text-gray-700">{user.phase || "---"}</p>
                <p className="mt-2 text-blue-600 font-semibold">{user.designation || "---"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Resources;

// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from '../../api/axios';

// const Resources = () => {
//   const navigate = useNavigate();
//   const { role,token } = useSelector((state) => state.auth);

//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filters state
//   const [nameFilter, setNameFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [designationFilter, setDesignationFilter] = useState('');
//   const [batchFilter, setBatchFilter] = useState('');
//   const [phaseFilter, setPhaseFilter] = useState('');

//   useEffect(() => {
//     // Fetch data from the endpoint
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`/api/users`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsers(response.data.data); 
//         console.log(response.data.data); 
//       } catch (err) {
//         console.log(err);
//         setError('Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchData();
//   }, [token]);
  

//   const filteredUsers = users.filter((user) => {
//     return (
//       (!nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
//       (!statusFilter || user.status === statusFilter) &&
//       (!designationFilter || user.designation === designationFilter) &&
//       (!batchFilter || user.batch.includes(batchFilter)) &&
//       (!phaseFilter || user.phase === phaseFilter)
//     );
//   });

//   if (role !== 'Admins') {
//     return (
//       <div className="p-6">
//         <p className="text-center text-red-600 text-lg font-semibold">
//           You are restricted from accessing this page.
//         </p>
//       </div>
//     );
//   }

//   if (loading) {
//     return <div className="p-6">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Filters Section */}
//       <div className="mb-6 flex flex-wrap gap-4 items-end">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Filter by Name</label>
//           <input
//             type="text"
//             value={nameFilter}
//             onChange={(e) => setNameFilter(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Enter name"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           >
//             <option value="">All</option>
//             <option value="SHADOWING">SHADOWING</option>
//             <option value="ACTIVE">ACTIVE</option>
//             <option value="NOT_ACTIVE">NOT_ACTIVE</option>
//             <option value="EXAMINATION">EXAMINATION</option>
//             <option value="DEPLOYED">DEPLOYED</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Filter by Designation</label>
//           <select
//             value={designationFilter}
//             onChange={(e) => setDesignationFilter(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           >
//             <option value="">All</option>
//             <option value="backend developer">Backend Developer</option>
//             <option value="frontend developer">Frontend Developer</option>
//             <option value="tester">Tester</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Filter by Batch</label>
//           <select
//             value={batchFilter}
//             onChange={(e) => setBatchFilter(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           >
//             <option value="">All</option>
//             <option value="Batch-1">Batch-1</option>
//             <option value="Batch-2">Batch-2</option>
//           </select>
//         </div>

//         {batchFilter && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Filter by Phase</label>
//             <select
//               value={phaseFilter}
//               onChange={(e) => setPhaseFilter(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             >
//               <option value="">All</option>
//               <option value="Phase 1">Phase 1</option>
//               <option value="Phase 2">Phase 2</option>
//               <option value="Phase 3">Phase 3</option>
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredUsers.map((user) => (
//           <div
//             key={user.id}
//             className="relative flex bg-white shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl transition-shadow"
//             onClick={() => navigate(`/dashboard/resources/${user.id}`)}
//           >
//             <div
//               className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
//                 user.status === 'SHADOWING' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
//               }`}
//             >
//               {user.status || "not updated"}
//             </div>

//             {/* Card Content */}
//             <div className="flex gap-4">
//               {/* Left Section: Profile Picture and Employee ID */}
//               <div className="flex flex-col items-center w-1/2">
//                 <img
//                   src={
//                     user.profilePhoto ||
//                     'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='
//                   }
//                   alt="profile"
//                   className="w-28 h-28 rounded-full object-cover mb-4"
//                 />
//                 <p className="text-sm text-gray-500 font-semibold">Emp ID: {user.employeeId || "not provided" }</p>
//               </div>

//               {/* Right Section: User Details */}
//               <div className="flex flex-col justify-center w-1/2 mt-4">
//                 <p className="text-lg font-bold">{user.name || "---"}</p>
//                 <p className="text-sm text-gray-500">Phone: {user.phone_no || "---"}</p>
//                 <p className="text-sm text-gray-700">{user.year || "---"} -  {user.batch || "---" }</p>
//                 <p className="text-sm text-gray-700">{user.phase || "---"}</p>
//                 <p className="mt-2 text-blue-600 font-semibold">{user.designation || "---"}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// };

// export default Resources;
