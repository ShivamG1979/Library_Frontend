import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/admin/login', { email, password });
            localStorage.setItem('adminToken', res.data.token);
    
            const config = { headers: { 'x-auth-token': res.data.token } };
            const profileRes = await axios.get('http://localhost:5000/api/auth/admin/profile', config);
    
            const username = profileRes.data.user.username;
            toast.success(`Welcome, Admin ${username}!`);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error in handleSubmit:', error.response ? error.response.data : error.message);
            toast.error('Error logging in: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Admin Login</h2>
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
                {loading && <div className="loading-spinner"></div>} {/* Loading spinner */}
                <div className="footer">
                    <p>If you don't have an admin account, please contact the system administrator.</p>
                    <button onClick={() => navigate('/')}>Home</button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
