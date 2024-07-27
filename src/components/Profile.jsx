import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import './Profile.css';

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('https://library-backend-evox.onrender.com/api/users/profile', config);

                if (data && data.user) {
                    setUserProfile(data.user);
                    setFormData({
                        username: data.user.username || '',
                        email: data.user.email || ''
                    });
                } else {
                    throw new Error('User data not found');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Error fetching profile data.');
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json',
                },
            };
    
            const { data } = await axios.put('https://library-backend-evox.onrender.com/api/auth/profile', formData, config);
    
            setUserProfile(data.user);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };
    
    if (userProfile === null) {
        return <p>Loading...</p>; 
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <p><strong>Username:</strong> {userProfile?.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {userProfile?.email || 'N/A'}</p>
                    <p><strong>User ID:</strong> {userProfile?._id || 'N/A'}</p>
                    <button onClick={handleEditClick}>Edit Profile</button>
                    <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
