import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';

const getParsedItem = (key, fallback) => {
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }  
};

const persistedState = {
  auth: {
    user: getParsedItem('user', null), 
    userId: localStorage.getItem('userId') || null, 
    name: localStorage.getItem('name') || null, 
    token: localStorage.getItem('token') || null, 
    role: localStorage.getItem('role') || null,
    permissions: getParsedItem('permissions', []), 
  },
};

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  preloadedState: persistedState,
});

export default store;
