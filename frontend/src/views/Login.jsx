import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SigninDB } from '../controller/userAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await SigninDB(email, password);
            console.log('Login response:', res);
            localStorage.setItem('authToken', res.token);  // Save the JWT token in localStorage
            localStorage.setItem('userId', res.uniqueId);  // Save the unique ID in localStorage
            localStorage.setItem('email', email);  // Save the email in localStorage

            navigate('/dashboard');  // Redirect to dashboard on successful login
            window.location.reload();
        } catch (error) {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
