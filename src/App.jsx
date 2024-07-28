import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserProfile from './components/UserProfile';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import AdminProfile from './components/AdminProfile';
import UserRegister from './pages/UserRegister';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './pages/UserDashboard';


const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/adminprofile" element={<AdminProfile />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        </Routes>
    </Router>
);

export default App;
