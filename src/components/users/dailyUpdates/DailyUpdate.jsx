import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isBefore, isAfter, subDays } from 'date-fns';

const DailyUpdate = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const joiningDate = new Date(2024, 8, 16); // September 16, 2024
  const tomorrow = addDays(new Date(), 1);

  const handleDateClick = (date) => {
    if (isBefore(date, joiningDate) || isAfter(date, tomorrow)) return;
    navigate(`${format(date, 'yyyy-MM-dd')}`);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full p-4 relative">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Daily Task Updates</h1>
      
      <div className="mb-4">
        <DatePicker
          selected={currentDate}
          onChange={(date) => setCurrentDate(date)}
          showMonthYearPicker
          dateFormat="MMMM yyyy"
          className="p-2 border rounded-lg text-center text-gray-700 focus:outline-none"
        />
      </div>
      
      <div className="grid grid-cols-7 p-4 w-full h-full border rounded-lg shadow-md relative">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-400">
            {day}
          </div>
        ))}
        {days.map((date) => {
          const isRestricted = isBefore(date, joiningDate) || isAfter(date, tomorrow);
          return (
            <div
              key={date}
              className={`p-5 border border-gray-300 text-center font-medium text-xl relative ${
                isSameMonth(date, currentDate)
                  ? isToday(date)
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-200'
                  : 'text-gray-400'
              } ${isRestricted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleDateClick(date)}
            >
              {format(date, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyUpdate;







// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isAfter, isBefore } from 'date-fns';

// const joiningDate = new Date(2024, 8, 16); // 16th Sep 2024 (Month is 0-based in JS)
// const tomorrow = addDays(new Date(), 1); // Tomorrow's date

// const DailyUpdate = () => {
//   const navigate = useNavigate();
//   const [currentDate, setCurrentDate] = useState(new Date());

//   // Generate days for the calendar
//   const startDate = startOfWeek(startOfMonth(currentDate));
//   const endDate = endOfWeek(endOfMonth(currentDate));
//   const days = [];
//   let day = startDate;

//   while (day <= endDate) {
//     days.push(day);
//     day = addDays(day, 1);
//   }

//   // Handle date click with restriction
//   const handleDateClick = (date) => {
//     if (!isBefore(date, joiningDate) && !isAfter(date, tomorrow)) {
//       navigate(`${format(date, 'yyyy-MM-dd')}`);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-start h-full bg-white p-4">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">Daily Task Updates</h1>

//       {/* Date Picker for Month & Year Selection */}
//       <div className="mb-4">
//         <DatePicker
//           selected={currentDate}
//           onChange={(date) => setCurrentDate(date)}
//           showMonthYearPicker
//           dateFormat="MMMM yyyy"
//           className="p-2 border rounded-lg text-center text-gray-700 focus:outline-none"
//         />
//       </div>

//       {/* Calendar Grid */}
//       <div className="grid grid-cols-7 gap-2 w-full h-full border p-4 rounded-lg shadow-md">
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//           <div key={day} className="text-center font-semibold text-gray-600">
//             {day}
//           </div>
//         ))}
//         {days.map((date) => {
//           const isRestricted = isBefore(date, joiningDate) || isAfter(date, tomorrow);
//           return (
//             <div
//               key={date}
//               className={`p-5 text-center cursor-pointer rounded-lg transition duration-300 ${
//                 isRestricted
//                   ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                   : isToday(date)
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-blue-100 hover:bg-blue-200'
//               }`}
//               onClick={() => !isRestricted && handleDateClick(date)}
//             >
//               {format(date, 'd')}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default DailyUpdate;



