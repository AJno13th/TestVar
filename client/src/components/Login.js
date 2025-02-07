import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handles login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, email: formData.email.toLowerCase() }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                setMessage(errorData?.message || 'Login failed. Please try again.');
                return;
            }

            const data = await response.json();
            setMessage('Login successful!');
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username); // Save username to local storage
            onLogin(data.token, data.username); // Notify parent of successful login with username
        } catch (error) {
            console.error('Login error:', error);
            setMessage('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {/* Login form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
