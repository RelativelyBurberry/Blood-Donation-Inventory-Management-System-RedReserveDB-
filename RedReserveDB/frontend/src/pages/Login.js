import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginUser(form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      const role = response.data.user.role;
      if (role === 'Admin') navigate('/admin/dashboard');
      if (role === 'Hospital') navigate('/hospital/requests');
      if (role === 'Donor') navigate('/donor/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <h2>Welcome to RedReserveDB</h2>
        <p style={{ color: 'var(--muted)' }}>Secure access for hospitals, donors, and admins.</p>
        {error && <div className="alert">{error}</div>}
        <form className="form-grid" onSubmit={handleLogin} style={{ marginTop: 16 }}>
          <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          New here? <Link to="/register" style={{ color: 'var(--primary)' }}>Create an account</Link>
        </p>
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
          Demo admin: admin@redreserve.com / Admin@123
        </p>
      </div>
    </div>
  );
};

export default Login;
