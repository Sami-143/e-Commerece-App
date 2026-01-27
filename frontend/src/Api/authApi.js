import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // update if different
  withCredentials: true, // important for cookies
});

// Register new user (sends OTP)
export const register = (userData) => API.post('/register', userData);

// Verify OTP (returns token & user via cookie + response body)
export const verifyOtp = (data) => API.post('/verify-otp', data);

// Resend OTP
export const resendOtp = (data) => API.post('/resend-otp', data);

// Login
export const login = (userData) => API.post('/login', userData);

// Forgot password email
export const sendResetEmail = (email) => API.post('/password/forgot', { email });

// You can add logout, me, etc. if needed:
export const logout = () => API.get('/logout');
export const getMe = () => API.get('/me');
