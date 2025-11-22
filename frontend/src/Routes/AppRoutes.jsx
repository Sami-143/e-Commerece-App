import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingRoutes from '../Components/LandingPages/LandingRoutes';
import SignUp from '../Components/Auth/SignUp';
import SignIn from '../Components/Auth/SignIn';
import OTPVerification from '../Components/Auth/OTPVerification';
import UpdatePassword from '../Components/Auth/UpdatePassword';
import SendEmail from '../Components/Auth/sendEmail';
import ResetPassword from '../Components/Auth/ResetPassword';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingRoutes />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/otp-verification" element={<OTPVerification />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/send-email" element={<SendEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
            </Routes>
        </Router>
    );
}

export default AppRoutes;