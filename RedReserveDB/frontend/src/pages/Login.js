import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = () => {
    const [role, setRole] = useState('Admin');
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await loginUser({ role, id });
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data));
                if (role === 'Admin') navigate('/admin');
                if (role === 'Hospital') navigate('/hospital');
                if (role === 'Donor') navigate('/donor');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your ID.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h3>Login to RedReserve</h3>
            <p><small>Hint: Admin ID is <b>ADMIN123</b></small></p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="Admin">Admin</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Donor">Donor</option>
                </select>
                <input 
                    type="text" 
                    placeholder={`${role} ID`} 
                    value={id} 
                    onChange={(e) => setId(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;