// LoginModal.jsx
import React from 'react';
import { FaUser, FaUserShield } from 'react-icons/fa';
import './LoginModal.css'; // Import modal styles

const LoginModal = ({ isOpen, onClose, onUserLogin, onAdminLogin }) => {
    if (!isOpen) return null; // Render nothing if not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Select Login Type</h2>
                <button className="modal-button" onClick={onUserLogin}>
                    <FaUser /> User Login
                </button>
                <button className="modal-button" onClick={onAdminLogin}>
                    <FaUserShield /> Admin Login
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
