import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
 
  return token ? children : <Navigate to="/" replace />; 
};

export default ProtectedRoute;
 