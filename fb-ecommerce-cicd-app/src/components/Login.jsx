import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await login(email, password);
            navigate('/');
        } catch (error) {
            setError('Failed to log in: ' + error.message);
        }
    };

    return (
        <div className='login-container'>
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='Email' value={email}
                onChange={(e) => setEmail(e.target.value)} required />

                <input type='password' placeholder='Password' value={password}
                onChange={(e) => setPassword(e.target.value)} required />

                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default Login;