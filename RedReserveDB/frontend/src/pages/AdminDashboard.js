import React, { useState } from 'react';
import { executeQuery } from '../services/api';

const AdminDashboard = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const queryList = [
        "1. Donors with Last & Next Eligible Date",
        "2. Most frequently requested blood group",
        "3. Donors who have not donated recently",
        "4. Total units per blood group",
        "5. Blood units expiring within 30 days",
        "6. Donation camps & units collected",
        "7. Pending requests",
        "8. All Donors list",
        "9. Available blood units with hospital details",
        "10. Average units per blood group"
    ];

   const runQuery = async (queryId) => {
        try {
            setError('');
            const response = await executeQuery(queryId);
            setResults(response.data.data);
        } catch (err) {
            // WE CHANGED THIS LINE to show the real error!
            setError('Error: ' + (err.response?.data?.error || err.message));
            setResults([]);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard - Database Queries</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {queryList.map((q, index) => (
                    <button key={index} onClick={() => runQuery(index + 1)} style={{ padding: '10px' }}>
                        {q}
                    </button>
                ))}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {results.length > 0 ? (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f4f4f4' }}>
                        <tr>
                            {Object.keys(results[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((row, i) => (
                            <tr key={i}>
                                {Object.values(row).map((val, j) => (
                                    <td key={j}>{val !== null ? val.toString() : 'NULL'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Select a query to view results.</p>
            )}
        </div>
    );
};

export default AdminDashboard;