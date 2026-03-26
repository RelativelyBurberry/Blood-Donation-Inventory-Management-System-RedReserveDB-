import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav style={{ padding: '10px 20px', backgroundColor: '#b30000', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <h2>RedReserveDB</h2>
            {user && (
                <div>
                    <span style={{ marginRight: '15px' }}>Logged in as: {user.role}</span>
                    <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '5px 10px' }}>Logout</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;