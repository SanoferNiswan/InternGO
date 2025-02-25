import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';  

const initialState = {
  name: Cookies.get('name') || null,
  token: Cookies.get('token') || null, 
  profilePhoto:Cookies.get("profilePhoto") || null,
}; 

const clearAllCookies = () => {
  Object.keys(Cookies.get()).forEach((cookie) => {
    Cookies.remove(cookie, { path: '/', domain: window.location.hostname });
  });
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      Object.assign(state, action.payload); 
    
      Object.keys(action.payload).forEach((key) => {
          Cookies.set(key, action.payload[key]==null?"":action.payload[key], { expires: 1/24, secure: true, sameSite: "Lax"});
      });
    },    
    clearAuth: (state) => {
      state.name = null;
      state.token = null;
      state.profilePhoto = null;

      clearAllCookies();
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
