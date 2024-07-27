import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [randomBooks, setRandomBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axios.get('https://library-backend-evox.onrender.com/api/books');
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

    const handleImageClick = () => {
        // Navigate to login page if not logged in
        alert('Please log in to view more details about the book.');
        navigate('/login');
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Library</h1>
            <div className="button-container">
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
            <div className="book-images">
                {randomBooks.map((book) => (
                    <div key={book._id} className="book-image" onClick={handleImageClick}>
                        <img src={book.image} alt={book.title} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
