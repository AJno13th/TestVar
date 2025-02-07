import React from 'react';

const TelemetryStats = ({ data }) => {
    // Ensure data is an array
    const telemetryData = Array.isArray(data) ? data : [];

    if (telemetryData.length === 0) {
        return <div style={styles.message}>No telemetry data available.</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Your Telemetry Data</h2>
            <ul style={styles.list}>
                {telemetryData.map((entry, index) => (
                    <li key={index} style={styles.listItem}>
                        <strong>Deck ID:</strong> {entry.deck_id} <br />
                        <strong>Score:</strong> {entry.score}% <br />
                        <strong>Time Taken:</strong> {entry.time_taken} seconds
                    </li>
                ))}
            </ul>
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
    list: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    message: {
        fontSize: '18px',
        color: '#777',
    },
};

export default TelemetryStats;