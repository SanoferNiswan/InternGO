import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import Cookies from 'js-cookie';

const persistedState = {
  auth: {
    user: JSON.parse(Cookies.get('user') || 'null'),
    userId: Cookies.get('userId') || null,
    name: Cookies.get('name') || null,
    token: Cookies.get('token') || null,
    role: Cookies.get('role') || null,
    permissions: JSON.parse(Cookies.get('permissions') || '[]'),
  },
};

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  preloadedState: persistedState,  
});

export default store;

