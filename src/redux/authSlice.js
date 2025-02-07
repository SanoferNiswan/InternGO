import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'; 

const initialState = {
  user: JSON.parse(Cookies.get('user') || 'null'),
  userId: Cookies.get('userId') || null,
  name: Cookies.get('name') || null,
  token: Cookies.get('token') || null,  
  role: Cookies.get('role') || null,
  permissions: JSON.parse(Cookies.get('permissions') || '[]'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, userId, name, token, role, permissions } = action.payload;

      state.user = user;
      state.userId = userId;
      state.name = name;
      state.token = token;
      state.role = role;
      state.permissions = permissions;

      Cookies.set('user', JSON.stringify(user), { expires: 2, secure: true });
      Cookies.set('userId', userId, { expires: 2, secure: true });
      Cookies.set('name', name, { expires: 2, secure: true });
      Cookies.set('token', token, { expires: 2, secure: true });
      Cookies.set('role', role, { expires: 2, secure: true });
      Cookies.set('permissions', JSON.stringify(permissions), { expires: 2, secure: true });
    },
    clearAuth: (state) => {
      state.user = null;
      state.userId = null;
      state.name = null;
      state.token = null;
      state.role = null;
      state.permissions = [];

      // Remove all cookies on logout
      Cookies.remove('user');
      Cookies.remove('userId');
      Cookies.remove('name');
      Cookies.remove('token');
      Cookies.remove('role');
      Cookies.remove('permissions');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
