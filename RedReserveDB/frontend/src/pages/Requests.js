import React, { useEffect, useState } from 'react';
import {
  approveRequest,
  createRequest,
  fulfillRequest,
  getHospitalRequests,
  getRequests,
  rejectRequest
} from '../services/api';

const Requests = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requestId: '',
    bloodGroup: 'A+',
    quantity: 1,
    hospitalId: user?.linkedId || '',
    patientId: '',
    urgency: 'Medium'
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = role === 'Hospital' ? await getHospitalRequests() : await getRequests();
      setRequests(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const timer = setInterval(fetchRequests, 20000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createRequest(form);
      setForm({ ...form, requestId: '', patientId: '', quantity: 1 });
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request.');
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      if (action === 'approve') await approveRequest(requestId);
      if (action === 'reject') await rejectRequest(requestId);
      if (action === 'fulfill') await fulfillRequest(requestId);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request.');
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">Blood Requests</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="alert" style={{ background: '#e0f2fe', color: '#0369a1' }}>Loading requests...</div>}

      {role === 'Hospital' && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginTop: 0 }}>Create New Request</h3>
          <form className="form-grid" onSubmit={handleCreate}>
            <input name="requestId" placeholder="Request ID (e.g., R100)" value={form.requestId} onChange={handleChange} required />
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required />
            <input name="hospitalId" value={form.hospitalId} onChange={handleChange} required readOnly />
            <input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={handleChange} required />
            <select name="urgency" value={form.urgency} onChange={handleChange}>
              {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <button className="btn" type="submit">Submit Request</button>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Request Pipeline</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Blood Group</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Urgency</th>
              <th>Hospital</th>
              {role === 'Admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.Request_id}>
                <td>{req.Request_id}</td>
                <td>{req.Blood_Group}</td>
                <td>{req.Quantity}</td>
                <td>{req.Status}</td>
                <td>{req.Urgency}</td>
                <td>{req.Hospital_id}</td>
                {role === 'Admin' && (
                  <td>
                    {req.Status === 'Pending' && (
                      <>
                        <button className="btn ghost" type="button" onClick={() => handleAction(req.Request_id, 'approve')}>Approve</button>
                        <button className="btn ghost" type="button" onClick={() => handleAction(req.Request_id, 'reject')} style={{ marginLeft: 8 }}>Reject</button>
                      </>
                    )}
                    {req.Status === 'Approved' && (
                      <button className="btn ghost" type="button" onClick={() => handleAction(req.Request_id, 'fulfill')}>Fulfill</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={role === 'Admin' ? 7 : 6}>No requests available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;
