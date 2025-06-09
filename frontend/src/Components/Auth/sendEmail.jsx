import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SendEmail = () => {
  const [email, setEmail] = useState('');

  const handleSendEmail = (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Simulate sending reset link
    toast.success(`Password reset link sent to ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <ToastContainer position="top-right" />
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmail;
