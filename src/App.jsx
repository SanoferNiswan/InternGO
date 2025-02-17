import React from "react";
import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import RoleProtectedRoute from "./components/protectedRoutes/RoleProtectedRoute";
import Feedback from "./components/admin/feedback/Feedback";
import Help from "./components/users/Help";
import Interaction from "./pages/interaction/Interaction";
import Plan from "./components/admin/plans/Plan";
import Resources from "./components/admin/profileManagement/Resources";
import EditProfile from "./components/users/profile/EditProfile";
import UserDetail from "./components/admin/profileManagement/UserDetail";
import NotFound from "./pages/NotFound";
import MyProfile from "./components/common/MyProfile";
import Milestones from "./components/admin/plans/Milestones";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminUpdate from "./components/admin/dailyUpdate/AdminUpdate";
import DailyUpdates from "./components/admin/dailyUpdate/DailyUpdates";
import InternUpdate from "./components/users/dailyUpdate/InternUpdate";
import DailyUpdate from "./components/users/dailyUpdate/DailyUpdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Forbidden from "./pages/Forbidden";
import AddUser from "./components/admin/profileManagement/AddUser";
import CreateFeedback from "./components/mentor/feedback/CreateFeedback";
import InteractionFeedback from "./components/admin/feedback/InteractionFeedback";
import UserFeedback from "./components/admin/feedback/UserFeedback";
import CreateAnnouncement from "./components/admin/announcement/CreateAnnouncement";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import PendingTickets from "./components/admin/help/PendingTickets";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Dashboard />} />

          <Route path="feedback" element={<Feedback />} />
          <Route path="interactions" element={<Interaction />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        <Route
          path="/intern/*"
          element={<RoleProtectedRoute allowedRoles={["Interns"]} />}
        >
          <Route path="daily-update" element={<DailyUpdate />} />
          <Route path="daily-update/:date" element={<InternUpdate />} />
          <Route path="help" element={<Help />} />
        </Route>

        <Route
          path="/mentor/*"
          element={<RoleProtectedRoute allowedRoles={["Mentors"]} />}
        >
          <Route path="feedback/create/:interactionID" element={<CreateFeedback />} />
          <Route path="feedback/view/:interactionId" element={<InteractionFeedback />} />
        </Route>

        <Route
          path="/admin/*"
          element={<RoleProtectedRoute allowedRoles={["Admins"]} />}
        >
          <Route path="plans" element={<Plan />} />
          <Route path="create-announcement" element={<CreateAnnouncement />} />
          <Route path="plans/:planId" element={<Milestones />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/:id" element={<UserDetail />} />
          <Route path="daily-update" element={<DailyUpdates />} />
          <Route path="daily-update/:date" element={<AdminUpdate />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="add-users" element={<AddUser />} />
          <Route path="feedback/:interactionId" element={<InteractionFeedback />} />
          <Route path="feedback/user/:userId" element={<UserFeedback />} />
          <Route path="pending-tickets" element={<PendingTickets />} />
        </Route>

        <Route path="*" element={<Navigate to="/not-found" replace />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/403" element={<Forbidden />} />
      </Routes>
    </Router>
  );
};

export default App;
