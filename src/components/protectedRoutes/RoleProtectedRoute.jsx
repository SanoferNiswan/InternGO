import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/auth";
import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../../pages/dashboard/DashboardLayout";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { token } = useSelector((state) => state.auth);
 
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const {role} = decodeToken(token);

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
