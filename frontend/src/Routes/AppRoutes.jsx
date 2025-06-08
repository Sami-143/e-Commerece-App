import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingRoutes from '../Components/LandingPages/LandingRoutes'
import SignUp from '../Components/Auth/SignUp'
import SignIn from '../Components/Auth/SignIn';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/landing-pages" element={<LandingRoutes />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<SignIn />} />
                
            </Routes>
        </Router>
    );
}

export default AppRoutes;