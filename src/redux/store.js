import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dataReducer from "./slices/dataSlice";
import Cookies from "js-cookie";

// Load Auth from Cookies
const persistedAuthState = {
  auth: {
    user: JSON.parse(Cookies.get("user") || "null"),
    userId: Cookies.get("userId") || null,
    name: Cookies.get("name") || null,
    token: Cookies.get("token") || null,
    role: Cookies.get("role") || null,
    profilePhoto:Cookies.get("profilePhoto") || null,
    permissions: JSON.parse(Cookies.get("permissions") || "[]"),
  },
};

// Load Data (mentors & filters) from localStorage
const persistedDataState = JSON.parse(localStorage.getItem("data")) || {
  mentors: [],
  filters: {
    years: [],
    statuses: [],
    designations: [],
    batches: [],
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
  preloadedState: {
    auth: persistedAuthState.auth,
    data: persistedDataState,
  }, 
});

store.subscribe(() => {
  const state = store.getState().data;
  localStorage.setItem("data", JSON.stringify(state));
});

export default store;

