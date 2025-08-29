import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '', password: '', 
        name: '', address: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await signup(formData.email, formData.password, {
                name: formData.name,
                address: formData.address
            });
            navigate('/');
        } catch (error) {
            setError('Failed to create account: ' + error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className='register-container'>
            <h2>Register</h2>
            {error && <div className='error'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type='email' name='email' placeholder='Email'
                value={formData.email} onChange={handleChange} required />

                <input type="password" name="password" placeholder="Password"
                value={formData.password} onChange={handleChange} required />

                <input type='text' name='name' placeholder='Full Name' 
                value={formData.name} onChange={handleChange} required />

                <input type='text' name='address' placeholder='Address' 
                value={formData.address} onChange={handleChange} />

                <button type='submit'>Register</button>
            </form>
        </div>
    );
};

export default Register;