import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate here
import './AdminDashboard.css'; // Import the CSS file for styling
import { toast } from 'react-toastify'; // Import toast for notifications

const AdminDashboard = () => {
    const [selectedSection, setSelectedSection] = useState('manageBooks');
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('http://localhost:5000/api/auth/admin/profile', config);
                setAdmin(data.user);
            } catch (error) {
                toast.error('Error fetching admin profile: ' + (error.response?.data?.message || error.message));
                navigate('/admin-login'); // Redirect to login page if there's an error
            }
        };

        fetchAdminProfile();
    }, [navigate]);

    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin-login'); // Redirect to the login page
    };

    return (
        <div className="admin-dashboard">
            <aside className="admin-dashboard__sidebar">
                <h2>Admin Dashboard</h2>
                <p>Welcome, {admin.username}!</p> {/* Display admin's username */}
                <ul>
                    <li>
                        <button onClick={() => handleSectionChange('manageBooks')}>
                            Manage Books
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange('manageUsers')}>
                            Manage Users
                        </button>
                    </li>
                    <li>
                        <button>
                            <Link to="/adminprofile">Profile</Link>
                        </button>
                    </li>
                    <li>
                        <button className="logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </aside>
            <main className="admin-dashboard__main-content">
                {selectedSection === 'manageBooks' && (
                    <div>
                        <h3>Manage Books</h3>
                        {/* Add components or code for managing books */}
                        <p>Here you can add, edit, or delete books.</p>
                    </div>
                )}
                {selectedSection === 'manageUsers' && (
                    <div>
                        <h3>Manage Users</h3>
                        {/* Add components or code for managing users */}
                        <p>Here you can view and manage user accounts.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
