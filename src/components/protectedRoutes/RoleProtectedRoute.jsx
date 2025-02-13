import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../../pages/dashboard/DashboardLayout";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useSelector((state) => state.auth);
 
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default RoleProtectedRoute;
