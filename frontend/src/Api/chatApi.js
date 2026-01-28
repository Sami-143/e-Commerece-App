import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
});

// User endpoints
export const getMyChat = () => API.get('/chat/my');
export const sendMessage = (message) => API.post('/chat/send', { message });

// Admin endpoints
export const getAllChats = () => API.get('/admin/chats');
export const getChatById = (id) => API.get(`/admin/chat/${id}`);
export const adminReply = (id, message) => API.post(`/admin/chat/${id}/reply`, { message });
export const markAsRead = (id) => API.put(`/admin/chat/${id}/read`);
export const closeChat = (id) => API.put(`/admin/chat/${id}/close`);
