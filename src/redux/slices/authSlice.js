import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';  

const initialState = {
  user: JSON.parse(Cookies.get('user') || 'null'),
  userId: Cookies.get('userId') || null,
  name: Cookies.get('name') || null,
  token: Cookies.get('token') || null,  
  role: Cookies.get('role') || null,
  profilePhoto:Cookies.get("profilePhoto") || null,
  permissions: JSON.parse(Cookies.get('permissions') || '[]'),
}; 

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      Object.assign(state, action.payload); 
    
      Object.keys(action.payload).forEach((key) => {
        if (key === "permissions" || key === "user") {
          Cookies.set(key, JSON.stringify(action.payload[key]), { expires: 1/24, secure: true, sameSite: "Lax" });
        } else {
          Cookies.set(key, action.payload[key]==null?"":action.payload[key], { expires: 1/24, secure: true, sameSite: "Lax"});
        }
      });
    },    
    clearAuth: (state) => {
      state.user = null;
      state.userId = null;
      state.name = null;
      state.token = null;
      state.role = null;
      state.profilePhoto = null;
      state.permissions = [];

      Cookies.remove('user');
      Cookies.remove('userId');
      Cookies.remove('name');
      Cookies.remove('token');
      Cookies.remove('role');
      Cookies.remove('profilePhoto');
      Cookies.remove('permissions');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
