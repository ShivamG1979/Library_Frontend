import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const [books, setBooks] = useState([]);
    const [cart, setCart] = useState([]);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', year: '', image: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [isCartView, setIsCartView] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [isDashboardView, setIsDashboardView] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('http://localhost:5000/api/books', config);

                const issued = data.filter(book => !book.available);
                const available = data.filter(book => book.available);

                setIssuedBooks(issued);
                setBooks(available);
            } catch (error) {
                console.error('Error fetching books', error);
                toast.error('Error fetching books');
            }
        };

        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const response = await axios.get('http://localhost:5000/api/auth/profile', config);
        
                setUserProfile(response.data.user);
            } catch (error) {
                console.error('Error fetching user profile', error);
                toast.error('Error fetching user profile');
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchBooks();
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully!');
        navigate('/');
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const { data } = await axios.post('http://localhost:5000/api/books', newBook, config);

            setCart(prevCart => [...prevCart, data._id]);
            setBooks(prevBooks => [...prevBooks, data]);

            toast.success('Book added to cart!');
            setIsAdding(false);
            setNewBook({ title: '', author: '', year: '', image: '' });
        } catch (error) {
            toast.error('Error adding book: ' + error.response?.data?.message || error.message);
        }
    };

    const handleAddToCart = (bookId) => {
        setCart(prevCart => [...prevCart, bookId]);
        toast.success('Book added to cart!');
    };

    const handleRemoveFromCart = (bookId) => {
        setCart(prevCart => prevCart.filter(id => id !== bookId));
        toast.success('Book removed from cart!');
    };

    const handleIssueBooks = async () => {
        if (selectedBooks.length === 0) {
            toast.error('No books selected for issue');
            return;
        }

        const confirmIssue = window.confirm("Are you sure you want to issue the selected books?");
        if (!confirmIssue) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await Promise.all(selectedBooks.map(bookId =>
                axios.put(`http://localhost:5000/api/books/issue/${bookId}`, {}, config)
            ));

            setIssuedBooks(prevIssuedBooks => [
                ...prevIssuedBooks,
                ...books.filter(book => selectedBooks.includes(book._id))
            ]);

            setBooks(prevBooks =>
                prevBooks.filter(book => !selectedBooks.includes(book._id))
            );

            setCart(prevCart => prevCart.filter(bookId => !selectedBooks.includes(bookId)));

            toast.success('Books issued successfully!');
            setIsCartView(false);
            setSelectedBooks([]);
        } catch (error) {
            toast.error('Error issuing books: ' + error.response?.data?.message || error.message);
        }
    };

    const handleDeleteBooks = async () => {
        if (selectedBooks.length === 0) {
            toast.error('No books selected for deletion');
            return;
        }
    
        const confirmDelete = window.confirm("Are you sure you want to delete the selected books?");
        if (!confirmDelete) return;
    
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await Promise.all(selectedBooks.map(bookId =>
                axios.delete(`http://localhost:5000/api/books/${bookId}`, config)
            ));
    
            setBooks(prevBooks => prevBooks.filter(book => !selectedBooks.includes(book._id)));
            setIssuedBooks(prevIssuedBooks =>
                prevIssuedBooks.filter(book => !selectedBooks.includes(book._id))
            );
    
            toast.success('Books deleted successfully!');
            setSelectedBooks([]);
        } catch (error) {
            toast.error('Error deleting books: ' + error.response?.data?.message || error.message);
        }
    };

    const handleSelectBook = (bookId) => {
        setSelectedBooks(prevSelected =>
            prevSelected.includes(bookId)
                ? prevSelected.filter(id => id !== bookId)
                : [...prevSelected, bookId]
        );
    };

    const goToDashboard = () => {
        setIsDashboardView(true);
        setIsCartView(false);
        setIsAdding(false);
        setIsDeleting(false);
        navigate('/user/dashboard');
    };

    const goToProfile = () => {
        navigate('/profile');
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1>Book Library</h1>
                {loadingProfile ? (
                    <p>Loading profile...</p>
                ) : userProfile ? (
                    <h2>Welcome, {userProfile.username}!</h2>
                ) : (
                    <p>Failed to load profile.</p>
                )}
            </header>
            <div className="main-content">
                <nav className="sidebar">
                    <button onClick={goToDashboard}>Dashboard</button>
                    <button onClick={() => setIsAdding(!isAdding)}>
                        {isAdding ? 'Cancel' : 'Add Book'}
                    </button>
                    <button onClick={() => setIsCartView(!isCartView)}>
                        {isCartView ? 'Cancel Cart' : 'View Cart'}
                    </button>
                    <button onClick={() => setIsDeleting(!isDeleting)}>
                        {isDeleting ? 'Cancel Delete' : 'Delete Books'}
                    </button>
                    <button onClick={goToProfile}>Profile</button>
                    <button onClick={handleLogout}>Logout</button>
                </nav>
                <main className="content">
                    {isAdding && !isCartView && !isDeleting && (
                        <form onSubmit={handleAddBook}>
                            <h2>Add Book</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newBook.title}
                                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Author"
                                value={newBook.author}
                                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Year"
                                value={newBook.year}
                                onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={newBook.image}
                                onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
                            />
                            <button type="submit">Add Book</button>
                        </form>
                    )}

                    {isDashboardView && !isCartView && !isAdding && !isDeleting && (
                        <div>
                            <h2>Dashboard</h2>
                            <div className="books-grid">
                                {issuedBooks.map((book) => (
                                    <div key={book._id} className="book-item">
                                         {book.user ? `${book.user.username}` : 'Unknown'}:Add This 
                                        <img src={book.image} alt={book.title} />
                                        <div className="book-info">
                                        
                            
                                            {book.title} by {book.author} ({book.year})
                                            <br />
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isCartView && !isAdding && !isDeleting && (
                        <div>
                            <h2>Cart</h2>
                            <div className="books-grid">
                                {books.filter(book => cart.includes(book._id)).map((book) => (
                                    <div key={book._id} className="book-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedBooks.includes(book._id)}
                                            onChange={() => handleSelectBook(book._id)}
                                        />
                                        <img src={book.image} alt={book.title} />
                                        <div className="book-info">
                                            {book.title} by {book.author} ({book.year})
                                        </div>
                                        <button onClick={() => handleRemoveFromCart(book._id)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleIssueBooks}>Issue Selected Books</button>
                        </div>
                    )}

                    {isDeleting && !isCartView && !isAdding && (
                        <div>
                            <h2>Delete Books</h2>
                            <div className="books-grid">
                                {books.concat(issuedBooks).map((book) => (
                                    <div key={book._id} className="book-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedBooks.includes(book._id)}
                                            onChange={() => handleSelectBook(book._id)}
                                        />
                                        <img src={book.image} alt={book.title} />
                                        <div className="book-info">
                                            {book.title} by {book.author} ({book.year})
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleDeleteBooks}>Delete Selected Books</button>
                        </div>
                    )}
                </main>
            </div>
            <footer className="footer">
                <p>&copy; 2024 Book Library</p>
            </footer>
        </div>
    );
};

export default UserDashboard;
