import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AdminProfile.css'; // Import the CSS file for styling

const AdminProfile = () => {
    const [admin, setAdmin] = useState({});
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('https://library-backend-ipoq.onrender.com/api/auth/admin/profile', config);
                setAdmin(data.user);
                setUsername(data.user.username);
                setEmail(data.user.email);
                setLoading(false);
            } catch (error) {
                toast.error('Error fetching profile: ' + (error.response?.data?.message || error.message));
                navigate('/admin-login');
            }
        };

        fetchAdminProfile();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { 'x-auth-token': token } };
    
            const updatedProfile = { username, email, password, newPassword };
            const response = await axios.put('https://library-backend-ipoq.onrender.com/api/auth/admin/profile', updatedProfile, config);
            console.log('Profile updated:', response.data);
            toast.success('Profile updated successfully');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
            
        }
    };
    

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-profile-container">
            <h2>Admin Profile</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Current Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={() => navigate('/admin/dashboard')} className="dashboard-button">
                Go to Admin Dashboard
            </button>
        </div>
    );
};

export default AdminProfile;
