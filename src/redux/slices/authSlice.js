import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';  

const initialState = {
  name: Cookies.get('name') || null,
  token: Cookies.get('token') || null, 
  profilePhoto:Cookies.get("profilePhoto") || null,
}; 

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      Object.assign(state, action.payload); 
    
      Object.keys(action.payload).forEach((key) => {
          Cookies.set(key, action.payload[key]==null?"":action.payload[key], { expires: 1/24, secure: false, sameSite: "Lax"});
      });
    },    

    clearAuth: (state) => {
      state.name = null;
      state.token = null;
      state.profilePhoto = null;
    
      console.log("Clearing auth cookies...");
    
      ["name", "token", "profilePhoto"].forEach((cookie) => {
        Cookies.remove(cookie, {
          path: "/",
          secure: false,
          sameSite: "Lax",
        });
      });
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
