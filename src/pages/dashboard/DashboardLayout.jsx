import React, { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AddUserModal from "../../components/admin/profileManagement/AddUserModal";
import NotificationBell from "../../components/notification/NotificationBell";
import { connectSocket } from "../../services/socketService";
import {
  FaUser,
  FaTasks,
  FaComments,
  FaCalendarAlt,
  FaPlusSquare,
  FaFileAlt,
  FaTicketAlt,
  FaBullhorn,
  FaChartLine,
  FaUserPlus,
  FaEdit,
  FaHandsHelping,
} from "react-icons/fa";
import GLogout from "../../components/authentication/GLogout";
import logo from "../../assets/interngo logo.png";
import { decodeToken } from "../../utils/auth";

const DashboardLayout = () => {
  const { name,token, profilePhoto } = useSelector(
    (state) => state.auth
  );

  const {userId, permissions,role} = decodeToken(token);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      name: "Profile",
      permission: "profile.update",
      path: "/dashboard/my-profile",
      icon: <FaUser />,
    },
    {
      name: "Resources",
      permission: "users.view",
      path: "/admin/resources",
      icon: <FaFileAlt />,
    },
    {
      name: "Plans",
      permission: "plans.create",
      path: "/admin/plans",
      icon: <FaPlusSquare />,
    },
    {
      name: "Daily Update",
      permission: "tasks.view",
      path: "/admin/daily-update",
      icon: <FaTasks />,
    },
    {
      name: "Daily Update",
      permission: "tasks.update",
      path: "/intern/daily-update",
      icon: <FaTasks />,
    },
    {
      name: "Interactions",
      permission: "interactions.view",
      path: "/dashboard/interactions",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Analytics",
      permission: "feedback.view",
      path: "/admin/analytics",
      icon: <FaComments />,
    },
    {
      name: "Pending Tickets",
      permission: "helpdesk.manage",
      path: "/admin/pending-tickets",
      icon: <FaTicketAlt />,
    },
    {
      name: "Pending Tickets",
      permission: "feedback.create",
      path: "/mentor/pending-tickets",
      icon: <FaTicketAlt />,
    },
    {
      name: "Create announcement",
      permission: "users.manage",
      path: "/admin/create-announcement",
      icon: <FaBullhorn />,
    },
    {
      name: "Help desk",
      permission: "tasks.update",
      path: "/intern/help",
      icon: <FaHandsHelping />,
    },
  ];

  const filteredTabs = tabs.filter((tab) =>
    permissions.includes(tab.permission)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (isModalOpen) {
      setDropdownOpen(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

    const socket = connectSocket(userId);
    socket.on("notification", (newNotification) => {
      setNotifications((prev) => [
        newNotification.createdNotification,
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification");
      // console.log("socket off");
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`api/notifications/${userId}`);

      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white p-2 pr-6 py-2 shadow-md top-0 left-0 right-0">
        <div className="flex items-center">
          <img
            src={logo}
            alt="InternGO"
            className="w-36 h-9 ml-2"
            onClick={() => navigate("/dashboard")}
          />
        </div>

        <div className="relative flex items-center space-x-4">
          <NotificationBell
            notifications={notifications}
            setNotifications={setNotifications}
          />

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 shadow-md text-blue-600 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 font-bold text-lg"
            >
              {profilePhoto ? (
                <img src={profilePhoto} className="w-9 h-9 rounded-full" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-blue-500">
                  {name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="truncate">{name}</span>
            </button>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50"
              >
                <ul className="py-2 flex flex-col">
                  <li
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      window.location.href = "/dashboard/edit-profile";
                    }}
                  >
                    <FaEdit /> Edit Profile
                  </li>
                  <hr />
                  {role === "Admins" && (
                    <li
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FaUserPlus />
                      Add users
                    </li>
                  )}
                  <hr />
                  <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                    <GLogout />
                  </li>
                </ul>
              </div>
            )}

            {isModalOpen && (
              <AddUserModal onClose={() => setIsModalOpen(false)} />
            )}
          </div>
        </div>
      </header>

      <div
        className={`bg-white text-black shadow-lg transition-all duration-200 fixed top-16 left-0 flex flex-col ${
          sidebarOpen ? "w-60 z-50" : "w-16"
        } h-screen`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <nav className="mt-4 flex-1">
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
      <main className="flex-1 p-4 pl-12 pt-4 overflow-y-auto ml-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
