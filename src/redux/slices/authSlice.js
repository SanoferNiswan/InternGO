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
          Cookies.set(key, action.payload[key]==null?"":action.payload[key], { expires: 1/24, secure: true, sameSite: "Lax"});
      });
    },    

    // clearAuth: (state) => {
    //   state.name = null;
    //   state.token = null;
    //   state.profilePhoto = null;
    
    //   ["name", "token", "profilePhoto"].forEach((cookie) => {
    //     document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    //     document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    //   });
    // },

    clearAuth: (state) => {
      state.name = null;
      state.token = null;
      state.profilePhoto = null;
    
      const domain = window.location.hostname.includes("vercel.app")
        ? ".vercel.app" 
        : window.location.hostname; 
    
      ["name", "token", "profilePhoto"].forEach((cookie) => {
        Cookies.remove(cookie, {
          path: "/", 
          domain: domain, 
          secure: true, 
          sameSite: "Lax", 
        });
      });
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
