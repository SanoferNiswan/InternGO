import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";

const jwt_decode = import("jwt-decode").then((module) => module.default);

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GLogin() { 
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const onSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const decode = await jwt_decode;
      const decodedData = decode(credential); 

      const { email, name } = decodedData;
      const allowedDomain = "finestcoder.com";

      if (email.split("@")[1] !== allowedDomain) {
        alert(
          "Authentication failed: Only @finestcoder.com email addresses are allowed."
        );
        return;
      }

      const response = await axios.post("/api/auth/oauth", {
        credential
      });
      const user = response.data?.data;
      console.log("response:",response.data);
      

      if (user?.token) {
        const { userId, role, permissions,zone, token,profilePhoto } = user;

        dispatch(setAuth({ user, userId, name, zone, token, role, permissions,profilePhoto }));

        navigate("/dashboard");
        console.log(user);
        
      } else {
        alert("Authentication failed: Unable to retrieve user details.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Authentication failed: Please try again.");
    }
  };

  const onFailure = () => {
    alert("Google Sign-In failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GLogin;
