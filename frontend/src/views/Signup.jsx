import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SignupDB } from '../controller/userAuth';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const res = await SignupDB(email, password); 
            localStorage.setItem('authToken', res.token); 
            localStorage.setItem('userId', res.uniqueId);
            localStorage.setItem('email', email);

            navigate('/dashboard');  // Redirect to dashboard after signup
            window.location.reload(); 
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); 
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
