import React, { useEffect, useState } from 'react';
import axios from '../../api/axios'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";

const Plan = () => {
  const { token,role } = useSelector((state) => state.auth);
  const [loading,setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [planDays, setPlanDays] = useState('');
  const [plans,setPlans] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    fetchPlans();
  },[]);

  const fetchPlans = async () =>{
    try{
      const response = await axios.get('/api/plans',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setPlans(response.data.data);
      console.log(response.data.data);
      
      setLoading(false);
    }
    catch(err){
      console.log(err);
      return <div>unauthorized</div>
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const planDetails = {
      name: planName,
      description: description,
      planDays: parseInt(planDays), 
    };

    console.log('Plan Details:', planDetails);

    try {
      const response = await axios.post(
        '/api/plans/create',
        planDetails, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {  
        const data = response.data.data; 
        console.log('Plan created successfully:', data);
        alert("Updated successfully");
        console.log(data);
        

        setPlans((prev) => [...prev, data]); 

        // Clear the form
        setPlanName('');
        setPlanDays('');
        setDescription('');
        setIsModalOpen(false);  
      } else {
        console.error('Failed to create plan');
      }
    } catch (error) {
      console.error('Error submitting plan:', error);
    }
};

  if(loading){
    return <div>Loading...</div>
  }

  if(role!="Admins"){
    return <div className='font-bold text-red-600'>You are restricted to access this page</div>
  }

  return (
    // <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

    //   {/* Dynamic Plan Cards */}
    //   {Array.isArray(plans) &&
    //     plans.map((plan) => (
    //       <div
    //         key={plan.id}
    //         className="relative flex flex-col bg-white shadow-lg p-6 rounded-lg cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105 h-[200px]"
    //         onClick={() => navigate(`/dashboard/plans/${plan.id}`)}
    //       >
    //         {/* Plan Name */}
    //         <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-2">
    //           <FaClipboardList className="text-blue-500 mr-2" /> {plan.name}
    //         </h2>

    //         {/* Description with Truncation */}
    //         <p className="text-gray-600 overflow-hidden text-ellipsis line-clamp-2 mt-3">
    //           {plan.description}
    //         </p>

    //         {/* Plan Duration */}
    //         <p className="text-gray-700 font-medium mt-auto flex items-center">
    //           <FaCalendarAlt className="text-green-500 mr-2" />
    //           {plan.planDays} Days
    //         </p>
    //       </div>
    //     ))}

    //   <div
    //     className='relative flex flex-col bg-white shadow-lg p-6 rounded-lg cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105 items-center justify-center'
    //     onClick={()=>setIsModalOpen(true)}
    //   >
    //     <p className='text-center text-5xl text-gray-500'>+</p>
    //     <p className='ml-2 mt-1 font-bold text-xl text-gray-400'>Create plan</p>
    //   </div>

    //   {isModalOpen && (
    //     <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50'>
    //       <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
    //         <div className='flex flex-row justify-between'>
    //           <h2 className='text-xl font-bold mb-4'>Create New Plan</h2>
    //           <button
    //             onClick={() => setIsModalOpen(false)}
    //             className='m-0 p-0 h-1 text-gray-500 hover:text-gray-700 text-xl'
    //           >
    //             X
    //           </button>
    //         </div>
    //         <form onSubmit={handleSubmit}>
    //           <div className='mb-4'>
    //             <label htmlFor='planName' className='block text-sm font-medium text-gray-600'>
    //               Plan Name
    //             </label>
    //             <input
    //               type='text'
    //               id='planName'
    //               value={planName}
    //               onChange={(e) => setPlanName(e.target.value)}
    //               className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md'
    //               required
    //             />
    //           </div>

    //           <div className='mb-4'>
    //             <label htmlFor='description' className='block text-sm font-medium text-gray-600'>
    //               Description
    //             </label>
    //             <textarea
    //               id='description'
    //               value={description}
    //               onChange={(e) => setDescription(e.target.value)}
    //               className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md'
    //               required
    //             />
    //           </div>

    //           <div className='mb-4'>
    //             <label htmlFor='planDays' className='block text-sm font-medium text-gray-600'>
    //               Number of Days
    //             </label>
    //             <input
    //               type='number'
    //               id='planDays'
    //               value={planDays}
    //               onChange={(e) => setPlanDays(e.target.value)}
    //               className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md'
    //               required
    //             />
    //           </div>

    //           <div className='flex flex-row gap-4'>
    //             <button
    //               type='submit'
    //               className='w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'
    //             >
    //               Create Plan
    //             </button>

    //             <button
    //               className='w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors'
    //               onClick={()=>setIsModalOpen(false)}
    //             >
    //               Cancel
    //             </button>
    //           </div>
    //         </form>

            
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Dynamic Plan Cards */}
  {Array.isArray(plans) &&
    plans.map((plan) => (
      <div
        key={plan.id}
        className="relative flex flex-col bg-white shadow-md p-5 rounded-xl cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 min-h-[180px]"
        onClick={() => navigate(`/dashboard/plans/${plan.id}`)}
      >
        {/* Plan Name */}
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaClipboardList className="text-blue-500 mr-2 text-xl" /> {plan.name}
        </h2>

        {/* Description with Truncation */}
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
          {plan.description}
        </p>

        {/* Plan Duration */}
        <p className="text-gray-700 font-medium mt-auto flex items-center text-sm">
          <FaCalendarAlt className="text-green-500 mr-2" />
          {plan.planDays} Days
        </p>
      </div>
    ))}

  {/* Add New Plan Button */}
  <div
    className="relative flex flex-col bg-white shadow-md p-6 rounded-xl cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 items-center justify-center min-h-[180px]"
    onClick={() => setIsModalOpen(true)}
  >
    <p className="text-center text-4xl text-gray-500">+</p>
    <p className="mt-1 font-bold text-gray-500">Create Plan</p>
  </div>

  {/* Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Create New Plan</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-600 hover:text-gray-900 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Days</label>
            <input
              type="number"
              value={planDays}
              onChange={(e) => setPlanDays(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
            >
              Create
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
};

export default Plan;
