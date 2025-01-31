import React from 'react';
import { useSelector } from 'react-redux';
import GLogout from '../../components/authentication/GLogout'; // Logout button component
import logo from '../../assets/logo.png';

const Dashboard = () => {
  const { name, permissions } = useSelector((state) => state.auth);

  const tabs = [
    { name: 'Profile', permission: 'profile.update', component: 'Profile' },
    { name: 'Daily Update', permission: 'tasks.update', component: 'DailyUpdate' },
    { name: 'RoadMap', permission: 'roadmaps.view', component: 'Roadmap' },
    { name: 'Help', permission: 'announcements.view', component: 'Help' },
    { name: 'Create RoadMap', permission: 'roadmaps.create', component: 'CreateRoadmap' },
    { name: 'FeedBack', permission: 'feedback.view', component: 'Feedback' },
    { name: 'Interactions', permission: 'interactions.view', component: 'Interactions' },
    { name: 'Create Plan', permission: 'plans.create', component: 'CreatePlan' },
    { name: 'Interaction Schedule', permission: 'interactions.schedule', component: 'InteractionSchedule' },
    { name: 'Records', permission: 'users.view', component: 'Records' },
    { name: 'Pending Tickets', permission: 'tickets.view', component: 'PendingTickets' },
    { name: 'Create Announcement', permission: 'announcements.create', component: 'CreateAnnouncement' },
  ];

  // Filter tabs based on permissions
  const filteredTabs = tabs.filter((tab) => permissions.includes(tab.permission));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 bg-white shadow-lg">
        <div className="flex flex-col items-center">
          <img src={logo} alt="InterGO" className="w-40 h-30" />
        </div>
        <nav className="mt-2">
          <ul>
            {filteredTabs.map((tab, index) => (
              <li key={index} className="mb-2">
                <a
                  href={`/${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                >
                  {tab.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-white rounded-full cursor-pointer">
              {name?.[0].toUpperCase()}
            </div>
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Edit Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <GLogout />
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Main Content Placeholder */}
        <main className="flex-1 p-6">
          <p className="text-gray-600">Select a tab from the sidebar to view its content.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
