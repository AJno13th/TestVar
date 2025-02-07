import React, { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handles user registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...formData, 
                    username: formData.username.toLowerCase(), 
                    email: formData.email.toLowerCase() 
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Registration successful!');
            } else {
                setMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred during registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {/* Registration form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                    }
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
