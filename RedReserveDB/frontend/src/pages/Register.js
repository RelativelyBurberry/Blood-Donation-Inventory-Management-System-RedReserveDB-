import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerDonor, registerHospital } from '../services/api';

const Register = () => {
  const [role, setRole] = useState('Donor');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [donorForm, setDonorForm] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'A+',
    lastDonationDate: '',
    password: ''
  });

  const [hospitalForm, setHospitalForm] = useState({
    hospitalId: '',
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    password: ''
  });

  const handleDonorChange = (e) => setDonorForm({ ...donorForm, [e.target.name]: e.target.value });
  const handleHospitalChange = (e) => setHospitalForm({ ...hospitalForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      if (role === 'Donor') {
        await registerDonor(donorForm);
        setMessage('Donor registration successful. You can now log in.');
      } else {
        await registerHospital(hospitalForm);
        setMessage('Hospital registration successful. You can now log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <h2>Create an account</h2>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {['Donor', 'Hospital'].map((item) => (
            <button
              key={item}
              className={`btn ${role === item ? '' : 'ghost'}`}
              type="button"
              onClick={() => setRole(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {message && <div className="alert" style={{ background: '#dcfce7', color: '#166534' }}>{message}</div>}
        {error && <div className="alert">{error}</div>}
        <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          {role === 'Donor' ? (
            <>
              <input name="userId" placeholder="Donor ID (e.g., U11)" onChange={handleDonorChange} required />
              <input name="firstName" placeholder="First Name" onChange={handleDonorChange} required />
              <input name="lastName" placeholder="Last Name" onChange={handleDonorChange} required />
              <input name="email" placeholder="Email" type="email" onChange={handleDonorChange} required />
              <input name="phoneNumber" placeholder="Phone Number" onChange={handleDonorChange} required />
              <select name="gender" onChange={handleDonorChange} value={donorForm.gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input name="dob" type="date" onChange={handleDonorChange} required />
              <select name="bloodGroup" onChange={handleDonorChange} value={donorForm.bloodGroup}>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              <input name="lastDonationDate" type="date" onChange={handleDonorChange} />
              <input name="password" placeholder="Password" type="password" onChange={handleDonorChange} required />
            </>
          ) : (
            <>
              <input name="hospitalId" placeholder="Hospital ID (e.g., H11)" onChange={handleHospitalChange} required />
              <input name="name" placeholder="Hospital Name" onChange={handleHospitalChange} required />
              <input name="address" placeholder="Address" onChange={handleHospitalChange} required />
              <input name="contactNumber" placeholder="Contact Number" onChange={handleHospitalChange} required />
              <input name="email" placeholder="Email" type="email" onChange={handleHospitalChange} required />
              <input name="password" placeholder="Password" type="password" onChange={handleHospitalChange} required />
            </>
          )}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          Already registered? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
