import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import GLogin from '../../components/authentication/GLogin';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authSlice';
 
const SignIn = () => {

  const dispatch = useDispatch();
  const SIGNIN_URL = "/api/auth/signin";
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SIGNIN_URL, formData);
      if (response.data) {
        const user = response.data.data;
        const { userId, name, token, role, permissions } = user;
  
        if (token) {
          // Persist and set state
          dispatch(setAuth({ user, userId, name, token, role, permissions }));
  
          // Navigate to dashboard
          navigate('/dashboard', { replace: true });
        }
      } else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Sign In Error:', error);
      alert(error);
    }
  };
  

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post(
//       SIGNIN_URL, 
//       formData
//     );
//     console.log(response,response.data.data);
//     if (response.data) {
//       const user=response.data.data;
//       console.log(user);
      
//       if(user.token){
//         document.cookie = `token=${user.token}; path=/; secure; HttpOnly; max-age=60`;
//         localStorage.setItem("token", user.token);
//         localStorage.setItem('roles', JSON.stringify(user.role));
//         localStorage.setItem('permissions', JSON.stringify(user.permissions));

//         // After successful login
//         dispatch(setAuth({ user, token: user.token, roles: user.role, permissions: user.permissions }));
//         navigate('/dashboard', { replace: true });
//       }
      
//     } else {
//       alert('Invalid email or password. Please try again.');
//     }
//   } catch (error) {
//     console.error('Sign In Error:', error);
//     alert('An error occurred while signing in. Please try again.');
//   }
// };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg shadow-gray-400">
        <h2 className="text-center text-2xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In 
          </button>
          <GLogin />
          <p className="text-sm text-center text-gray-700 mt-4">
            Don't have an account?{' '}
            <NavLink
              className="text-blue-600 hover:underline cursor-pointer"
              to={'/signup'}
            >
              Sign Up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
