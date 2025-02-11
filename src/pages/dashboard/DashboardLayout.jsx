import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AddUserModal from "../../components/admin/profileManagement/AddUserModal";
import NotificationBell from "../../components/notification/NotificationBell";
import { connectSocket, getSocket } from "../../services/socketService";
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
  FaUserEdit, FaUserPlus,
  FaEdgeLegacy,
  FaEdit
} from "react-icons/fa";
import GLogout from "../../components/authentication/GLogout";
import logo from "../../assets/logo2.png";

const DashboardLayout = () => {
  const { name, userId, role, permissions,token } = useSelector(
    (state) => state.auth
  );


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  const tabs = [
    {
      name: "Profile",
      permission: "profile.update",
      path: "/dashboard/my-profile",
      icon: <FaUser />,
    },
    {
      name:"Add user",
      permission:"users.manage",
      path: "/admin/add-users",
      icon: <FaUserPlus />,
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
    // {
    //   name: "RoadMap",
    //   permission: "roadmaps.view",
    //   path: "/dashboard/roadmap",
    //   icon: <FaMapMarkedAlt />,
    // },
    {
      name: "Help",
      permission: "announcements.view",
      path: "/dashboard/help",
      icon: <FaHandsHelping />,
    },
    {
      name: "FeedBack",
      permission: "feedback.view",
      path: "/admin/feedback",
      icon: <FaComments />,
    },
    {
      name: "FeedBack",
      permission: "feedback.create",
      path: "/mentor/feedback",
      icon: <FaComments />,
    },
    {
      name: "Interactions",
      permission: "interactions.view",
      path: "/dashboard/interactions",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Resources",
      permission: "users.view",
      path: "/admin/resources",
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
  const [isModalOpen , setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

    const socket = connectSocket(userId);
    socket.on("notification", (newNotification) => {
      setNotifications((prev) => [newNotification.createdNotification, ...prev]);
      console.log("new notification",newNotification.createdNotification.message);
      
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);


  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`api/notifications/${userId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/*  Navbar */}
      <header className="flex items-center justify-between bg-white p-2 pr-6 py-2 shadow-md top-0 left-0 right-0">
        <div className="flex items-center">
          <img src={logo} alt="InternGO" className="w-10 h-10 mr-2" />
          <span className="font-bold text-xl text-gray-700">InternGO </span>
        </div>

        <div className="relative flex items-center space-x-4">
          <NotificationBell notifications={notifications} setNotifications={setNotifications}/>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 shadow-md text-blue-600 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 font-bold text-lg"
            >
              <span>{name}</span>
              <div className="w-8 h-8 text-white bg-blue-500 flex items-center justify-center rounded-full">
                {name?.[0]?.toUpperCase()}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50">
                <ul className="py-2 flex flex-col ">
                  <li
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                    onClick={() =>
                      (window.location.href = "/dashboard/edit-profile")
                    }
                  >
                   <FaEdit /> Edit Profile
                  </li> <hr />
                  <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2" onClick={()=>setIsModalOpen(true)}>
                  <FaUserPlus />Add users
                  </li><hr />
                  <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                    <GLogout />
                  </li>
                </ul>
              </div>
            )}

            {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} />}
          </div>
        </div>
      </header>

      {/* sidebar */}

      <div
        className={`bg-white text-black shadow-lg transition-all duration-200 fixed top-16 left-0 flex flex-col ${
          sidebarOpen ? "w-52 z-50" : "w-16"
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
