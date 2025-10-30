import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";

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
      const allowedDomain1 = "codingmart.in";
      const allowedDomain2 = "codingmart.com";
      const allowedDomain3 = "finestcoder.com";

      if (email.split("@")[1] !== allowedDomain1 && email.split("@")[1] !== allowedDomain2 && email.split("@")[1] !== allowedDomain3) {
        toast.error(
          "Authentication failed: invalid domain - Try Codingmart or finestcoder account"
        );
        return;
      }

      const response = await axios.post("/api/auth/oauth", {
        credential
      });
      const user = response.data?.data;
      

      if (user?.token) {
        const { token,profilePhoto } = user;

        dispatch(setAuth({ name, token,profilePhoto }));

        navigate("/dashboard",{replace:true});
        
      } else {
        alert("Authentication failed: Unable to retrieve user details.");
      }
    } catch (error) {
      toast.error("Authentication failed: Please try again.");
    }
  };

  const onFailure = () => {
    toast.error("Google Sign-In failed. Please try again.");
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
