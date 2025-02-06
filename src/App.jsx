import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/authentication/SignIn';
import SignUp from './pages/authentication/SignUp';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DailyUpdate from './components/users/dailyUpdates/DailyUpdate'
import DailyUpdates from './components/admin/dailyUpdate/DailyUpdates'; 
import Feedback from '../src/components/users/Feedback'
import Help from '../src/components/users/Help'
import Interaction from './pages/interaction/Interaction';
import Profile from '../src/components/common/Profile'
import InteractionSchedule from './components/admin/interaction/InteractionSchedule'
import Plan from '../src/components/admin/plans/Plan'
import Records from './components/admin/profileManagement/Resources'
import EditProfile from './components/users/EditProfile';
import Roadmap from './components/common/Roadmap';
import UserDetail from './components/admin/profileManagement/UserDetail';
import NotFound from './pages/NotFound';
import MyProfile from './components/common/MyProfile';
import Milestones from './components/admin/plans/Milestones';
import Dashboard from './pages/dashboard/Dashboard';
import InternUpdate from './components/users/dailyUpdates/InternUpdate';
import AdminUpdate from './components/admin/dailyUpdate/AdminUpdate';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
const App = () => {
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
                {/* Protected Dashboard Routes */}
                <Route
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="daily-update" element={<DailyUpdate />} />
                    <Route path="feedback" element={<Feedback />} />
                    <Route path="help" element={<Help />} />
                    <Route path="interactions" element={<Interaction />} />
                    <Route path="my-profile" element={<MyProfile />} />
                    <Route path="interaction-schedule" element={<InteractionSchedule />} />
                    <Route path="plan" element={<Plan />} />
                    <Route path="resources" element={<Records />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="roadmap" element={<Roadmap />} />
                    <Route path="resources/:id" element={<UserDetail />} />
                    <Route path="plans" element={<Plan />}/>
                    <Route path="plans/:planId" element={<Milestones />}/>

                    <Route path="daily-update/:date" element={<InternUpdate />} />
                    <Route path="daily-update" element={<DailyUpdate />}/>

                    <Route path="daily-updates/:date" element={<AdminUpdate />}/>
                    <Route path="daily-updates" element={<DailyUpdates />}/>
                </Route>
            </Routes>
        </Router>
    );
};
 
export default App;
 