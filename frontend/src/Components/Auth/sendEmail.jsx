import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendResetEmail } from '../../Api/authApi'; // make sure path is correct

const SendEmail = () => {
  const [email, setEmail] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const res = await sendResetEmail(email);
      toast.success(res.data.message);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <ToastContainer position="top-right" />
      <div className="bg-gray-900 rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Forgot Password</h2>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-blue-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmail;
