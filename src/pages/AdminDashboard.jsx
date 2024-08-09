import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [selectedSection, setSelectedSection] = useState('viewAllBooks');
    const [admin, setAdmin] = useState({});
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookForm, setBookForm] = useState({ title: '', author: '', year: '', image: '', available: true });
    const [userForm, setUserForm] = useState({ username: '', email: '', password: '' });
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    // Fetch admin profile
    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('http://localhost:5000/api/auth/admin/profile', config);
    
                // Debugging
                console.log('Fetched Admin Data:', data.user);
    
                if (data.user && data.user._id) {
                    setAdmin(data.user);
                } else {
                    console.error('Admin data is missing _id field');
                }
            } catch (error) {
                toast.error('Error fetching admin profile: ' + (error.response?.data?.message || error.message));
                navigate('/admin-login');
            }
        };
    
        fetchAdminProfile();
    }, [navigate]);
    
    
    
    

    // Fetch books and users
    useEffect(() => {
        const fetchBooksAndUsers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = { headers: { 'x-auth-token': token } };

                if (selectedSection === 'viewAllBooks') {
                    const { data } = await axios.get('http://localhost:5000/api/auth/admin/books', config);
                    setBooks(data);
                } else {
                    const [booksRes, usersRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/auth/admin/books', config),
                        axios.get('http://localhost:5000/api/auth/admin/users', config)
                    ]);

                    setBooks(booksRes.data);
                    setUsers(usersRes.data);  // Ensure this includes user IDs
                }
            } catch (error) {
                toast.error('Error fetching data: ' + (error.response?.data?.message || error.message));
            }
        };

        fetchBooksAndUsers();
    }, [selectedSection]);

    // Handle section change
    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    // Handle delete book
    const handleDeleteBook = async (bookId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { 'x-auth-token': token } };
            await axios.delete(`http://localhost:5000/api/auth/admin/books/${bookId}`, config);
            setBooks(books.filter(book => book._id !== bookId));
            toast.success('Book deleted successfully');
        } catch (error) {
            toast.error('Error deleting book: ' + (error.response?.data?.message || error.message));
        }
    };




// Handle issue book
const handleIssueBook = async (bookId) => {
    try {
        const token = localStorage.getItem('adminToken');
        const config = { headers: { 'x-auth-token': token } };
        const userId = admin._id; // Ensure this is correctly set

        if (!userId) {
            throw new Error('Admin user ID is not available.');
        }

        const response = await axios.put(
            `http://localhost:5000/api/books/issue/${bookId}`,
            { userId },
            config
        );

        setBooks(books.map(book =>
            book._id === bookId ? { ...book, available: false } : book
        ));

        toast.success('Book issued successfully');
    } catch (error) {
        console.error('Error issuing book:', error);
        toast.error('Error issuing book: ' + (error.response?.data?.message || error.message));
    }
};






    // Handle add or edit book
    const handleAddOrEditBook = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { 'x-auth-token': token } };
    
            if (selectedBook) {
                // Edit existing book
                await axios.put(`http://localhost:5000/api/auth/admin/books/${selectedBook._id}`, { ...bookForm }, config);
                setBooks(books.map(book => book._id === selectedBook._id ? { ...bookForm, _id: selectedBook._id } : book));
                toast.success('Book updated successfully');
            } else {
                // Add new book
                const { data } = await axios.post('http://localhost:5000/api/auth/admin/books', { ...bookForm, user: admin._id }, config);
                setBooks([...books, data]);
                toast.success('Book added successfully');
            }
    
            setBookForm({ title: '', author: '', year: '', image: '', available: true });
            setSelectedBook(null);
            handleSectionChange('viewAllBooks'); // Refresh the view
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            toast.error('Error adding/editing book: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { 'x-auth-token': token } };
            await axios.delete(`http://localhost:5000/api/auth/admin/users/${userId}`, config);
            setUsers(users.filter(user => user._id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Error deleting user: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle add or edit user
    const handleEditUser = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { 'x-auth-token': token } };

            if (editingUser) {
                // Update existing user
                await axios.put(`http://localhost:5000/api/auth/admin/users/${editingUser._id}`, userForm, config);
                setUsers(users.map(user => user._id === editingUser._id ? { ...userForm, _id: editingUser._id } : user));
                toast.success('User updated successfully');
            } else {
                // Add new user
                const { data } = await axios.post('http://localhost:5000/api/auth/admin/users', userForm, config);
                setUsers([...users, data]);
                toast.success('User added successfully');
            }

            setUserForm({ username: '', email: '', password: '' });
            setEditingUser(null);
        } catch (error) {
            toast.error('Error adding/editing user: ' + (error.response?.data?.message || error.message));
        }
    };
    const handleProfileClick = () => {
        navigate('/adminprofile');
    };
    return (
        <div className="admin-dashboard">
            <header className="admin-dashboard__header">
                <h2> Dashboard</h2>
                <p>Welcome, {admin.username}!</p>
            </header>
            <aside className="admin-dashboard__sidebar">
                
                <ul>
                    <li>
                        <button onClick={() => handleSectionChange('viewAllBooks')}>View All Books</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange('manageUsers')}>Manage Users</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange('addOrEditBook')}>Add New Book</button>
                    </li>
                    <li>
                        <button onClick={() => handleSectionChange('addOrEditUser')}>Add New User</button>
                    </li>
                    <li>
                    <button onClick={handleProfileClick}>
            Profile
        </button>
                    
                    </li>
                    <li>
                        <button className="logout" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </aside>
            <main className="admin-dashboard__main-content">
            {selectedSection === 'viewAllBooks' && (
    <div>
    <h3>All Books</h3>
    <table className="admin-book-table">
        <thead>
            <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Available</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {books.length > 0 ? (
                books.map(book => (
                    <tr key={book._id}>
                        <td><img src={book.image} alt={book.title} /></td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.year}</td>
                        <td>{book.available ? 'Yes' : 'No'}</td>
                        <td className="admin-book-actions">
                            <button onClick={() => {
                                setSelectedBook(book);
                                setBookForm({ title: book.title, author: book.author, year: book.year, image: book.image, available: book.available });
                                handleSectionChange('addOrEditBook');
                            }}>Edit</button>
                            <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
                            <button onClick={() => handleIssueBook(book._id)} disabled={!book.available}>Issue</button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6">No books found.</td>
                </tr>
            )}
        </tbody>
    </table>
</div>

)}


                {selectedSection === 'addOrEditBook' && (
                    <div className='addOrEditBook'>
                        <h3>{selectedBook ? 'Edit Book' : 'Add New Book'}</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddOrEditBook(); }}>
                            <label>
                                Title:
                                <input type="text" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required />
                            </label>
                            <label>
                                Author:
                                <input type="text" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} required />
                            </label>
                            <label>
                                Year:
                                <input type="number" value={bookForm.year} onChange={(e) => setBookForm({ ...bookForm, year: e.target.value })} required />
                            </label>
                            <label>
                                Image URL:
                                <input type="text" value={bookForm.image} onChange={(e) => setBookForm({ ...bookForm, image: e.target.value })} required />
                            </label>
                            <label>
                                Available:
                                <input type="checkbox" checked={bookForm.available} onChange={(e) => setBookForm({ ...bookForm, available: e.target.checked })} />
                            </label>
                            <button type="submit">{selectedBook ? 'Update Book' : 'Add Book'}</button>
                            <button type="button" onClick={() => {
                                setSelectedBook(null);
                                setBookForm({ title: '', author: '', year: '', image: '', available: true });
                                handleSectionChange('viewAllBooks');
                            }}>Cancel</button>
                        </form>
                    </div>
                )}

                {selectedSection === 'manageUsers' && (
                    <div>
                        <h3>Manage Users</h3>
                        <ul className="user-list">
                            {users.length > 0 ? (
                                users.map(user => (
                                    <li key={user._id} className="user-list__item">
                                        <div className="user-details">
                                            <strong>Username:</strong> {user.username} <br />
                                            <strong>Email:</strong> {user.email} <br />
                                        </div>
                                        <div className="user-actions">
                                            <button onClick={() => {
                                                setEditingUser(user);
                                                setUserForm({ username: user.username, email: user.email, password: '' });
                                                handleSectionChange('addOrEditUser');
                                            }}>Edit</button>
                                            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p>No users found.</p>
                            )}
                        </ul>
                    </div>
                )}

                {selectedSection === 'addOrEditUser' && (
                    <div className='addOrEditUser'>
                        <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditUser(); }}>
                            <label>
                                Username:
                                <input type="text" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} required />
                            </label>
                            <label>
                                Email:
                                <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
                            </label>
                            <label>
                                Password:
                                <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required={!editingUser} />
                            </label>
                            <button type="submit">{editingUser ? 'Update User' : 'Add User'}</button>
                            <button type="button" onClick={() => {
                                setEditingUser(null);
                                setUserForm({ username: '', email: '', password: '' });
                                handleSectionChange('manageUsers');
                            }}>Cancel</button>
                        </form>
                    </div>
                )}
            </main>
            <footer className="admin-dashboard__footer">
            <p>&copy; 2024 Book Library</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
