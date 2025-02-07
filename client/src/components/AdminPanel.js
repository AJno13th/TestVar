import React, { useState } from 'react';

const AdminPanel = ({ stats, onUpdateLimit, onUpdateRole }) => {
    const [limit, setLimit] = useState('');
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('user');

    // Handles updating the daily deck limit
    const handleUpdateLimit = () => {
        if (!limit || isNaN(limit)) {
            alert('Please enter a valid limit.');
            return;
        }
        onUpdateLimit(limit);
        setLimit('');
    };

    // Handles updating a user's role
    const handleUpdateRole = () => {
        if (!userId || !role) {
            alert('Please enter a valid user ID and role.');
            return;
        }
        onUpdateRole(userId, role);
        setUserId('');
        setRole('user');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Admin Panel</h2>
            
            {/* System Statistics Section */}
            <div style={styles.section}>
                <h3 style={styles.subheading}>System Statistics</h3>
                <p style={styles.text}>Total Users: {stats?.totalUsers}</p>
                <p style={styles.text}>Total Decks: {stats?.totalDecks}</p>
                <p style={styles.text}>Total Flashcards: {stats?.totalFlashcards}</p>
            </div>
            
            {/* Update Daily Deck Limit Section */}
            <div style={styles.section}>
                <h3 style={styles.subheading}>Update Daily Deck Limit</h3>
                <input
                    type="number"
                    placeholder="New limit"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    style={styles.input}
                />
                <button style={styles.button} onClick={handleUpdateLimit}>
                    Update Limit
                </button>
            </div>
            
            {/* Update User Role Section */}
            <div style={styles.section}>
                <h3 style={styles.subheading}>Update User Role</h3>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={styles.input}
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.select}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button style={styles.button} onClick={handleUpdateRole}>
                    Update Role
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        margin: '20px auto',
        padding: '20px',
        maxWidth: '600px',
        borderRadius: '10px',
        background: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    section: {
        marginBottom: '20px',
    },
    subheading: {
        fontSize: '20px',
        marginBottom: '10px',
        color: '#555',
    },
    text: {
        fontSize: '16px',
        color: '#777',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
    },
    select: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
};

export default AdminPanel;