import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file

const UserRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true); // New loading state
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate an initial loading period (e.g., fetching data or initializing the page)
        const timer = setTimeout(() => setLoading(false), 500); // Adjust the timeout as needed

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Show spinner when registration starts
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error('Error registering: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false); // Hide spinner after registration completes
        }
    };

    return (
        <div className="auth-container">
            {loading ? (
                <div className="loading-spinner"></div> // Show loading spinner
            ) : (
                <form onSubmit={handleSubmit} className="form">
                    <h2>Register</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <div className="footer">
                        <p>If you have an account, <a href="/login">Login</a></p>
                        <button onClick={() => navigate('/')}>Home</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserRegister;
