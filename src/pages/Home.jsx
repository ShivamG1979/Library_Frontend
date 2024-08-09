import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserEdit} from 'react-icons/fa'; // Importing icons
import LoginModal from './LoginModal';
import './Home.css';
import logo from '../assets/logo.jpg'; 

const Home = () => {
    const [randomBooks, setRandomBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
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
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={logo} alt="Library Logo" className="logo" />
                    <h1>Library</h1>
                </div>
                <div className="navbar-right">
                    <button onClick={() => setIsModalOpen(true)}>
                        <FaUser /> Log In
                    </button>
                    <button onClick={() => navigate('/register')}>
                        <FaUserEdit />Register
                    </button>
                </div>
            </nav>
            <div className="content">
                <h1>Welcome to the Library</h1>
                <div className="book-images">
                    {randomBooks.map((book) => (
                        <div key={book._id} className="book-image" onClick={() => handleImageClick(book._id)}>
                            <img src={book.image} alt={book.title} />
                        </div>
                    ))}
                </div>
            </div>
            
            <footer className="footer">
                <p>© 2024 Library. All rights reserved.</p>
            </footer>

            <LoginModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onUserLogin={() => navigate('/login')} 
                onAdminLogin={() => navigate('/admin-login')} 
            />
        </div>
    );
};

export default Home;
