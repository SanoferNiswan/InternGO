import axios from "axios";
import store from "../redux/store"
import { clearAuth } from "../redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error)
    console.log("rejected here");
    
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearAuth()); 
      window.location.href = "/signin"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 