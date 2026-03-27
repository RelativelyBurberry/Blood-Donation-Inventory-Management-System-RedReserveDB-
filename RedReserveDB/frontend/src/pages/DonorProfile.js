import React, { useEffect, useState } from 'react';
import { donorHistory, getMe } from '../services/api';

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getMe();
      setProfile(response.data.user.profile);
      if (response.data.user.linkedId) {
        const historyResponse = await donorHistory(response.data.user.linkedId);
        setHistory(historyResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">Donor Profile</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="alert" style={{ background: '#e0f2fe', color: '#0369a1' }}>Loading profile...</div>}
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Personal Details</h3>
          {profile ? (
            <>
              <p><strong>Name:</strong> {profile.First_Name} {profile.Last_Name}</p>
              <p><strong>Email:</strong> {profile.Email}</p>
              <p><strong>Phone:</strong> {profile.Phone_Number}</p>
              <p><strong>Blood Group:</strong> {profile.Blood_Group}</p>
              <p><strong>Last Donation:</strong> {profile.Last_Donation_Date ? String(profile.Last_Donation_Date).split('T')[0] : '-'}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Eligibility</h3>
          <p style={{ color: 'var(--muted)' }}>
            Donors should wait 56 days between donations. Your next eligible date is calculated in the admin reports.
          </p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Donation History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Blood Group</th>
              <th>Collected</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((unit) => (
              <tr key={unit.Unit_Number}>
                <td>{unit.Unit_Number}</td>
                <td>{unit.Blood_Group}</td>
                <td>{unit.Collected_Date ? String(unit.Collected_Date).split('T')[0] : '-'}</td>
                <td>{unit.Status}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="4">No donations recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorProfile;
