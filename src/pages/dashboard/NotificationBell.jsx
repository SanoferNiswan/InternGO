import React, { useState } from "react";
import { FaBell } from "react-icons/fa";

const NotificationBell = ({ notifications, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-gray-700 hover:text-blue-600 focus:outline-none relative"
      >
        <FaBell className="text-2xl" /> 
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 flex justify-between items-center border-b border-gray-300">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 text-sm">
              ✖ Close
            </button>
          </div>

          <div className="overflow-y-auto h-72 px-1 py-2">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">No new notifications</p>
            ) : (
              <ul>
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className={`py-3 px-4 border-b border-gray-200 flex justify-between items-center ${
                      notification.isRead ? "text-gray-400" : "text-gray-700 font-medium"
                    }`}
                  >
                    <p className="text-xs font-medium">{notification.message}</p>
                    {!notification.isRead && (
                      <button
                        onClick={() => onMarkAsRead(index)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;




// import React, { useState } from "react";
// import { FaBell } from "react-icons/fa";

// const NotificationBell = ({ notifications }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
//       >
//         <FaBell className="text-xl" />
//         {notifications.length > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
//             {notifications.length}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//           <div className="p-4">
//             <h3 className="font-semibold text-gray-700">Notifications</h3>
//             <ul className="mt-2">
//               {notifications.map((notification, index) => (
//                 <li key={index} className="py-2 border-b border-gray-200">
//                   <p className="text-sm text-gray-600">{notification.message}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;