import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import GLogin from '../../components/authentication/GLogin';
import axios from '../../api/axios';
 
const SignUp = () => {

  const SIGNUP_URL = '/api/auth/signup';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Name is required.' : '';
      case 'email':
        if (value.trim() === '') return 'Email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Invalid email format.';
      case 'password':
        if (value.trim() === '') return 'Password is required.';
        if (value.length < 8) return 'Password must be at least 8 characters long.';
        if (!/[A-Z]/.test(value)) return 'Password must include at least 1 uppercase letter.';
        if (!/[a-z]/.test(value)) return 'Password must include at least 1 lowercase letter.';
        if (!/[0-9]/.test(value)) return 'Password must include at least 1 number.';
        if (!/[@$!%*?&]/.test(value)) return 'Password must include at least 1 special character.';
        return '';
      case 'confirmPassword':
        if (value.trim() === '') return 'Please confirm your password.';
        return value === formData.password ? '' : 'Passwords do not match.';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    }); 
    setErrors(newErrors);
  
    const isValid = Object.values(newErrors).every((error) => !error);
    if (isValid) {
      try {
        const {confirmPassword,...data} = formData;

        const response = await axios.post(SIGNUP_URL, data);
        console.log(response);
        
        if (response.data.statusCode === 201) {
          alert(response.data.message);
          navigate('/signin');
        }
      } catch (error) {
        console.error('Sign Up Error:', error);
        if (error.response) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert('Network error, please try again later.');
        }
      }
    }
  };
  

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword((prev) => !prev);
    if (field === 'confirmPassword') setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 ${
                errors.name ? 'focus:ring-red-500' : 'focus:ring-primary'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-500' : 'focus:ring-primary'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 rounded border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-500' : 'focus:ring-primary'
                }`}
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 rounded border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-primary'
                }`}
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <GLogin />

          <p className="text-center text-sm text-gray-700 mt-4">
            Already have an account?{' '}
            <NavLink to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;