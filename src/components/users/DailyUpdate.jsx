import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, addMonths, subMonths, setMonth, setYear } from 'date-fns';

const DailyUpdates = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate days for the current month
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Handle date click
  const handleDateClick = (date) => {
    navigate(`/daily-update/${format(date, 'yyyy-MM-dd')}`);
  };

  // Handle month change
  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    setCurrentMonth(setMonth(currentMonth, newMonth));
  };

  // Handle year change
  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setCurrentMonth(setYear(currentMonth, newYear));
  };

  // Generate month and year options
  const months = Array.from({ length: 12 }, (_, i) => format(new Date().setMonth(i), 'MMMM'));
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="flex flex-col w-full h-full bg-white p-4 justify-center items-center">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Daily Task Updates</h1>

      {/* Month and Year Selectors */}
      <div className="flex gap-4 mb-4">
        <select
          value={currentMonth.getMonth()}
          onChange={handleMonthChange}
          className="p-2 border rounded-lg"
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={currentMonth.getFullYear()}
          onChange={handleYearChange}
          className="p-2 border rounded-lg"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 w-full  h-screen border p-4 rounded-lg shadow-md">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days.map((date) => (
          <div
            key={date}
            className={`p-3 text-center cursor-pointer rounded-lg transition duration-300 ${
              isSameMonth(date, currentMonth)
                ? isToday(date)
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 hover:bg-blue-200'
                : 'text-gray-400'
            }`}
            onClick={() => handleDateClick(date)}
          >
            {format(date, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyUpdates;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday } from 'date-fns';

// const DailyUpdates = () => {
//   const navigate = useNavigate();
//   const [currentMonth, setCurrentMonth] = useState(new Date());

//   const startDate = startOfWeek(startOfMonth(currentMonth));
//   const endDate = endOfWeek(endOfMonth(currentMonth));
//   const days = [];
//   let day = startDate;

//   while (day <= endDate) {
//     days.push(day);
//     day = addDays(day, 1);
//   }

//   const handleDateClick = (date) => {
//     navigate(`/daily-update/${format(date, 'yyyy-MM-dd')}`);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">Daily Task Updates</h1>
//       <div className="grid grid-cols-7 gap-2 w-full max-w-4xl border p-4 rounded-lg shadow-md">
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//           <div key={day} className="text-center font-semibold text-gray-600">{day}</div>
//         ))}
//         {days.map((date) => (
//           <div
//             key={date}
//             className={`p-3 text-center cursor-pointer rounded-lg transition duration-300 ${
//               isSameMonth(date, currentMonth)
//                 ? isToday(date)
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-blue-100 hover:bg-blue-200'
//                 : 'text-gray-400'
//             }`}
//             onClick={() => handleDateClick(date)}
//           >
//             {format(date, 'd')}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DailyUpdates;
