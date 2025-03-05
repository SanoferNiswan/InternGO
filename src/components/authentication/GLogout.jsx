import { useDispatch } from "react-redux";
import { clearAuth } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const GLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  // checking clear auth commit
  const onLogout = () => {
    dispatch(clearAuth());
    console.log("clear auth");
    
    navigate("/");
  };

  return (
    <button
      onClick={onLogout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default GLogout;
