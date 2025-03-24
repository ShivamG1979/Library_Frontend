import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // New loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when request starts
        try {
            // Login request
            const res = await axios.post('https://library-backend-ipoq.onrender.com/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);

            // Fetch user profile to get the username
            const config = { headers: { 'x-auth-token': res.data.token } };
            const profileRes = await axios.get('https://library-backend-ipoq.onrender.com/api/auth/profile', config);

            // Extract username from profile response
            const username = profileRes.data.user.username;

            // Show welcome toast
            toast.success(`Welcome, ${username}!`);

            // Navigate to dashboard
            navigate('/user/dashboard');
        } catch (error) {
            toast.error('Error logging in: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Login</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {loading && <div className="loading-spinner"></div>} 
                <div className="footer">
                    <p>If you don't have an account, <a href="/register">Register</a></p>
                    <button onClick={() => navigate('/')}>Home</button>
                </div>
            </form>
        </div>
    );
};

export default UserLogin;
