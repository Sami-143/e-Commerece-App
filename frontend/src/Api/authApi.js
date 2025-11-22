import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // adjust as needed
  withCredentials: true, // allow sending cookies (JWT)
});

// Register new user
export const register = (userData) => API.post('/register', userData);

// Login user
export const login = (userData) => API.post('/login', userData);

// Send forgot password email
export const sendResetEmail = (email) => API.post('/password/forgot', { email });

