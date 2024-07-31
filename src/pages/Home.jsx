import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserPlus, FaUserShield } from 'react-icons/fa'; // Importing icons
import './Home.css';

const Home = () => {
    const [randomBooks, setRandomBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/books');
                // Select random books
                const shuffled = data.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 6);
                setRandomBooks(selected);
            } catch (error) {
                console.error('Error fetching books', error);
            }
        };

        fetchBooks();
    }, []);

    const handleImageClick = (bookId) => {
        // Check if user is logged in
        const isLoggedIn = Boolean(localStorage.getItem('token')); 

        if (isLoggedIn) {
            // Navigate to the book details page
            navigate(`/book/${bookId}`);
        } else {
            // Show notification and redirect to login
            alert('Please log in first.');
            navigate('/login');
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Library</h1>
            <div className="button-container">
                <button onClick={() => navigate('/login')}>
                    <FaUser /> User Login
                </button>
                <button onClick={() => navigate('/register')}>
                    <FaUserPlus /> User Register
                </button>
                <button onClick={() => navigate('/admin-login')}>
                    <FaUserShield /> Admin Login
                </button>
            </div>
            <div className="book-images">
                {randomBooks.map((book) => (
                    <div key={book._id} className="book-image" onClick={() => handleImageClick(book._id)}>
                        <img src={book.image} alt={book.title} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;