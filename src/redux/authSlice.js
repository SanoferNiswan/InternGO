
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  userId: null,
  name: null,
  token: null,
  role: null,
  permissions: [],
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

      // Persist state to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('permissions', JSON.stringify(permissions));
    },
    clearAuth: (state) => {
      state.user = null;
      state.userId = null;
      state.name = null;
      state.token = null;
      state.role = null;
      state.permissions = [];

      // Clear from localStorage on logout
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('permissions');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
