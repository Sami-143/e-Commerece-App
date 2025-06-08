import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const OTPVerification = () => {
  const email = localStorage.getItem('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }

    if (!email) {
      toast.error('Email is missing for verification.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otpCode === '123456') {
        toast.success('OTP verified successfully!');
        // Simulate navigation
        window.location.href = '/dashboard';
      } else {
        toast.error('Invalid OTP. Try again.');
      }
    }, 1000);
  };

  const handleResend = () => {
    if (!email) {
      toast.error('Email not found.');
      return;
    }

    toast.success('OTP resent successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="bg-[#1e293b] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#334155]">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Verify Your Email</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter the 6-digit code sent to <span className="text-blue-400">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 text-center text-lg text-white bg-[#0f172a] border border-[#334155] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Didn't get the code?{' '}
            <button onClick={handleResend} className="text-blue-400 hover:underline">
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
