import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  FaUser,
  FaTasks,
  FaMapMarkedAlt,
  FaHandsHelping,
  FaComments,
  FaCalendarAlt,
  FaPlusSquare,
  FaFileAlt,
  FaTicketAlt,
  FaBullhorn,
  FaChartLine,
  FaBell,
} from "react-icons/fa";
import GLogout from "../../components/authentication/GLogout";
import logo from "../../assets/logo2.png";

const DashboardLayout = () => {
  const { name, role, permissions } = useSelector((state) => state.auth);
  const location = useLocation();

  const tabs = [
    {
      name: "Profile",
      permission: "profile.update",
      path: "/dashboard/my-profile",
      icon: <FaUser />,
    },
    {
      name: "Plans",
      permission: "plans.create",
      path: "/dashboard/plans",
      icon: <FaPlusSquare />,
    },
    {
      name: "Daily Update",
      permission: "tasks.update",
      path: "/dashboard/daily-update",
      icon: <FaTasks />,
    },
    {
      name: "Daily Update",
      permission: "tasks.view",
      path: "/dashboard/daily-updates",
      icon: <FaTasks />,
    },
    {
      name: "RoadMap",
      permission: "roadmaps.view",
      path: "/dashboard/roadmap",
      icon: <FaMapMarkedAlt />,
    },
    {
      name: "Help",
      permission: "announcements.view",
      path: "/dashboard/help",
      icon: <FaHandsHelping />,
    },
    {
      name: "FeedBack",
      permission: "feedback.view",
      path: "/dashboard/feedback",
      icon: <FaComments />,
    },
    {
      name: "FeedBack",
      permission: "feedback.create",
      path: "/dashboard/feedback",
      icon: <FaComments />,
    },
    {
      name: "Interactions",
      permission: "interactions.view",
      path: "/dashboard/interactions",
      icon: <FaCalendarAlt />,
    },
    // {
    //   name: "Schedule",
    //   permission: "interactions.schedule",
    //   path: "/dashboard/interaction-schedule",
    //   icon: <FaCalendarAlt />,
    // },
    {
      name: "Resources",
      permission: "users.view",
      path: "/dashboard/resources",
      icon: <FaFileAlt />,
    },
    {
      name: "Pending Tickets",
      permission: "tickets.view",
      path: "/dashboard/pending-tickets",
      icon: <FaTicketAlt />,
    },
    {
      name: "Create Announcement",
      permission: "announcements.create",
      path: "/dashboard/create-announcement",
      icon: <FaBullhorn />,
    },
  ];

  const filteredTabs = tabs.filter((tab) =>
    permissions.includes(tab.permission)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    // <div className="flex h-screen bg-gray-100">
    //   {/* Sidebar */}
    //   <div
    //     className={`bg-white text-black shadow-lg transition-all duration-300 ${
    //       sidebarOpen ? "w-52" : "w-16"
    //     } h-screen fixed top-0 left-0 flex flex-col`}
    //   >
    //     <div className="flex items-center py-4 px-3">
    //       <img src={logo} alt="InternGO" className="mr-2 w-8 h-12" />
    //       <p
    //         className={`ml-3 text-lg font-bold text-gray-700 transition-all duration-300 ${
    //           sidebarOpen ? "opacity-100" : "opacity-0"
    //         }`}
    //       >
    //         InternGo
    //       </p>
    //     </div>

    //     {/* Navigation */}
    //     <nav className="mt-2 flex-1">
    //       <ul>
    //         <li key="dashboard">
    //           <NavLink
    //             to="/dashboard"
    //             className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
    //               location.pathname === "/dashboard"
    //                 ? "bg-blue-100 text-blue-600 font-semibold"
    //                 : "hover:bg-blue-50"
    //             }`}
    //           >
    //             <FaChartLine className="text-xl" />
    //             {sidebarOpen && <span>Dashboard</span>}
    //           </NavLink>
    //         </li>
    //         {filteredTabs.map((tab, index) => (
    //           <li key={index}>
    //             <NavLink
    //               to={tab.path}
    //               className={({ isActive }) =>
    //                 `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
    //                   isActive
    //                     ? "bg-blue-100 text-blue-600 font-semibold"
    //                     : "hover:bg-blue-50"
    //                 }`
    //               }
    //             >
    //               {tab.icon}
    //               {sidebarOpen && <span>{tab.name}</span>}
    //             </NavLink>
    //           </li>
    //         ))}
    //       </ul>
    //     </nav>

    //     <button
    //       onClick={() => setSidebarOpen(!sidebarOpen)}
    //       className="absolute bottom-4 left-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
    //     >
    //       {sidebarOpen ? "<" : ">"}
    //     </button>
    //   </div>

    //   {/* Main Content */}
    //   <div
    //     className="flex-1 flex flex-col ml-auto"
    //     style={{ marginLeft: sidebarOpen ? "13rem" : "4rem" }}
    //   >
    //     <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
    //       <h1 className="text-2xl font-semibold text-gray-700">
    //         {role || ""} Dashboard
    //       </h1>
    //       <div className="relative flex items-center space-x-4">
    //         <button
    //           onClick={() => alert("Notification clicked")}
    //           className="relative p-2 text-gray-600 hover:text-gray-900"
    //         >
    //           <FaBell className="w-6 h-6" />
    //           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
    //             3
    //           </span>
    //         </button>

    //         <div className="relative">
    //           <button
    //             onClick={() => setDropdownOpen(!dropdownOpen)}
    //             className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-600"
    //           >
    //             <span>{name}</span>
    //             <div className="w-8 h-8 bg-white text-blue-600 flex items-center justify-center rounded-full">
    //               {name?.[0]?.toUpperCase()}
    //             </div>
    //           </button>

    //           {dropdownOpen && (
    //             <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50">
    //               <ul className="py-2">
    //                 <li
    //                   className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
    //                   onClick={() =>
    //                     (window.location.href = "/dashboard/edit-profile")
    //                   }
    //                 >
    //                   Edit Profile
    //                 </li>
    //                 <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
    //                   <GLogout />
    //                 </li>
    //               </ul>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </header>

    //     <main className="flex-1 p-6 overflow-y-auto">
    //       <Outlet />
    //     </main>
    //   </div>
    // </div>
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white text-black shadow-lg transition-all duration-100 ${
          sidebarOpen ? "w-52" : "w-16"
        } h-screen fixed top-0 left-0 flex flex-col`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex items-center py-4 px-3">
          <img src={logo} alt="InternGO" className="mr-2 w-8 h-10" />
          <p
            className={`ml-3 text-lg font-bold text-gray-700 transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            InternGo
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1">
          <ul>
            <li key="dashboard">
              <NavLink
                to="/dashboard"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-blue-50"
                }`}
              >
                <FaChartLine className="text-xl" />
                {sidebarOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            {filteredTabs.map((tab, index) => (
              <li key={index}>
                <NavLink
                  to={tab.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "hover:bg-blue-50"
                    }`
                  }
                >
                  {tab.icon}
                  {sidebarOpen && <span>{tab.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col ml-auto"
        style={{ marginLeft: sidebarOpen ? "13rem" : "4rem" }}
      >
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            {role || ""} Dashboard
          </h1>
          <div className="relative flex items-center space-x-4">
            <button
              onClick={() => alert("Notification clicked")}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <FaBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-600"
              >
                <span>{name}</span>
                <div className="w-8 h-8 bg-white text-blue-600 flex items-center justify-center rounded-full">
                  {name?.[0]?.toUpperCase()}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50">
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() =>
                        (window.location.href = "/dashboard/edit-profile")
                      }
                    >
                      Edit Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                      <GLogout />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
