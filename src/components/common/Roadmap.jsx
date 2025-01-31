import React, { useState } from 'react';

const Roadmap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [noOfDays, setNoOfDays] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    const planDetails = {
      name: planName,
      description: description,
      noOfDays: parseInt(noOfDays), 
    };

    console.log('Plan Details:', planDetails);
    alert("plan created succesfully");

    // Send the data to a server via POST request
    // try {
    //   const response = await fetch('https://your-api-endpoint.com/create-plan', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(planDetails), // Convert object to JSON string
    //   });

    //   // Handle the server response
    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log('Plan created successfully:', data);
    //     setIsModalOpen(); // Close the modal after successful submission
    //   } else {
    //     console.error('Failed to create plan');
    //   }
    // } catch (error) {
    //   console.error('Error submitting plan:', error);
    // }
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div
        className='relative flex bg-white shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl transition-shadow h-60 items-center justify-center'
        onClick={()=>setIsModalOpen(true)}
      >
        <p className='text-center text-5xl text-gray-500'>+</p>
        <p className='ml-2 mt-1 font-bold text-xl text-gray-400'>Create Roadmap</p>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <div className='flex flex-row justify-between'>
              <h2 className='text-xl font-bold mb-4'>Create Roadmap</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='m-0 p-0 h-1 text-gray-500 hover:text-gray-700 text-xl'
              >
                X
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label htmlFor='planName' className='block text-sm font-medium text-gray-600'>
                  Plan Name
                </label>
                <input
                  type='text'
                  id='planName'
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md'
                  required
                />
              </div>

              <div className='mb-4'>
                <label htmlFor='description' className='block text-sm font-medium text-gray-600'>
                  Description
                </label>
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md'
                  required
                />
              </div>

              <div className='mb-4'>
                <label htmlFor='noOfDays' className='block text-sm font-medium text-gray-600'>
                  Number of Days
                </label>
                <input
                  type='number'
                  id='noOfDays'
                  value={noOfDays}
                  onChange={(e) => setNoOfDays(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md'
                  required
                />
              </div>

              <div className='flex flex-row gap-4'>
                <button
                  type='submit'
                  className='w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'
                >
                  Create Plan
                </button>

                <button
                  className='w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors'
                  onClick={()=>setIsModalOpen(false)}
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

export default Roadmap;

