import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { currentUser } = useAuth();

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Welcome to E-Commerce App</h1>
            
            {currentUser ? (
                <div>
                    <p>Hello, {currentUser.email}!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <Link to="/products">
                            <button>Manage Products</button>
                        </Link>
                        <Link to="/orders">
                            <button>View Orders</button>
                        </Link>
                        <Link to="/profile">
                            <button>Edit Profile</button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Please log in to access the application</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;