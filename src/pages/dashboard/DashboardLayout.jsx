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
  FaChartLine
} from "react-icons/fa";
import GLogout from "../../components/authentication/GLogout";
import logo from "../../assets/logo2.png";

const DashboardLayout = () => {
  const { name, role, permissions } = useSelector((state) => state.auth);
  const location = useLocation();
  const tabs = [
    { name: "Profile", permission: "profile.update", path: "/dashboard/my-profile", icon: <FaUser /> },
    { name: "Plans", permission: "plans.create", path: "/dashboard/plans", icon: <FaPlusSquare /> },
    { name: "Daily Update", permission: "tasks.update", path: "/dashboard/daily-update", icon: <FaTasks /> },
    { name: "RoadMap", permission: "roadmaps.view", path: "/dashboard/roadmap", icon: <FaMapMarkedAlt /> },
    { name: "Help", permission: "announcements.view", path: "/dashboard/help", icon: <FaHandsHelping /> },
    { name: "FeedBack", permission: "feedback.view", path: "/dashboard/feedback", icon: <FaComments /> },
    { name: "Interactions", permission: "interactions.view", path: "/dashboard/interactions", icon: <FaCalendarAlt /> },
    { name: "Interaction Schedule", permission: "interactions.schedule", path: "/dashboard/interaction-schedule", icon: <FaCalendarAlt /> },
    { name: "Resources", permission: "users.view", path: "/dashboard/resources", icon: <FaFileAlt /> },
    { name: "Pending Tickets", permission: "tickets.view", path: "/dashboard/pending-tickets", icon: <FaTicketAlt /> },
    { name: "Create Announcement", permission: "announcements.create", path: "/dashboard/create-announcement", icon: <FaBullhorn /> },
  ]; 

  const filteredTabs = tabs.filter((tab) => permissions.includes(tab.permission));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-300 text-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <div className="flex flex-row items-center py-4">
          <img
            src={logo}
            alt="InternGO"
            className={`transition-all duration-300 w-11 h-11 ml-2`}
          />
          <p className="ml-3 font-extrabold ">{sidebarOpen ? "InternGo" : ""}</p>
        </div>
        <nav className="mt-2">
          <ul>
          <li key={12} className="flex items-center">
          <NavLink
            to="/dashboard"
            className={`flex w-full items-center space-x-2 px-4 py-2 text-black hover:bg-gray-200 rounded-lg ${
              location.pathname === "/dashboard" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            <span className="text-xl">{<FaChartLine />}</span>
            {sidebarOpen && <span>{"Dashboard"}</span>}
          </NavLink>

            </li>
            {filteredTabs.map((tab, index) => (
              <li key={index} className="flex items-center">
                <NavLink
                  to={tab.path}
                  className={({ isActive }) =>
                    `flex w-full items-center space-x-2 px-4 py-2 text-black hover:bg-gray-200 rounded-lg ${
                      isActive ? "bg-gray-200 font-semibold" : ""
                    }`
                  }
                >
                  <span className="text-xl">{tab.icon}</span>
                  {sidebarOpen && <span>{tab.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-4 left-4 bg-gray-300 p-2 rounded-full hover:bg-gray-400"
        >
          {sidebarOpen ? "<" : ">"}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h1 className="text-2xl font-semibold text-gray-700">{role || ""} Dashboard</h1>
          <div className="relative flex items-center space-x-4">
            <button
              onClick={() => alert("Notification clicked")}
              className="relative w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center hover:bg-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                3
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-gray-300 text-white px-3 py-2 rounded-full cursor-pointer hover:bg-gray-400"
              >
                <span>{name}</span>
                <div className="flex items-center justify-center w-8 h-8 bg-white text-gray-700 rounded-full">
                  {name?.[0]?.toUpperCase()}
                </div>
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50"
                  style={{ top: "calc(100% + 8px)" }}
                >
                  <ul className="py-2">
                    <li
                      onClick={() => (window.location.href = "/dashboard/edit-profile")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Edit Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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

