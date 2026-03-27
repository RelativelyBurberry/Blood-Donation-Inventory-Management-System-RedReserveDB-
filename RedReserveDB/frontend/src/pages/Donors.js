import React, { useEffect, useState } from 'react';
import { deleteDonor, donorHistory, getDonors, updateDonor } from '../services/api';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState('');
  const [editDonor, setEditDonor] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDonors();
      setDonors(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleHistory = async (donorId) => {
    try {
      const response = await donorHistory(donorId);
      setHistory(response.data.data);
      setSelectedDonor(donorId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history.');
    }
  };

  const handleDelete = async (donorId) => {
    try {
      await deleteDonor(donorId);
      fetchDonors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete donor.');
    }
  };

  const handleEditOpen = (donor) => {
    setEditDonor({
      donorId: donor.Donor_id,
      firstName: donor.First_Name,
      lastName: donor.Last_Name,
      email: donor.Email,
      phoneNumber: donor.Phone_Number,
      gender: donor.Gender,
      dob: donor.DOB ? String(donor.DOB).split('T')[0] : '',
      bloodGroup: donor.Blood_Group,
      lastDonationDate: donor.Last_Donation_Date ? String(donor.Last_Donation_Date).split('T')[0] : ''
    });
  };

  const handleEditChange = (e) => {
    setEditDonor({ ...editDonor, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await updateDonor(editDonor.donorId, editDonor);
      setEditDonor(null);
      fetchDonors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update donor.');
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">Donor Management</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="alert" style={{ background: '#e0f2fe', color: '#0369a1' }}>Loading donors...</div>}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Registered Donors</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Blood Group</th>
              <th>Email</th>
              <th>Last Donation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => (
              <tr key={donor.Donor_id}>
                <td>{donor.First_Name} {donor.Last_Name}</td>
                <td>{donor.Blood_Group}</td>
                <td>{donor.Email}</td>
                <td>{donor.Last_Donation_Date ? String(donor.Last_Donation_Date).split('T')[0] : '-'}</td>
                <td>
                  <button className="btn ghost" type="button" onClick={() => handleHistory(donor.Donor_id)}>
                    View History
                  </button>
                  <button className="btn ghost" type="button" style={{ marginLeft: 8 }} onClick={() => handleEditOpen(donor)}>
                    Edit
                  </button>
                  <button className="btn ghost" type="button" style={{ marginLeft: 8 }} onClick={() => handleDelete(donor.Donor_id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {donors.length === 0 && (
              <tr>
                <td colSpan="5">No donors registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editDonor && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>Edit Donor</h3>
          <form className="form-grid" onSubmit={handleEditSave}>
            <input name="firstName" value={editDonor.firstName} onChange={handleEditChange} required />
            <input name="lastName" value={editDonor.lastName} onChange={handleEditChange} required />
            <input name="email" value={editDonor.email} onChange={handleEditChange} required />
            <input name="phoneNumber" value={editDonor.phoneNumber} onChange={handleEditChange} required />
            <select name="gender" value={editDonor.gender} onChange={handleEditChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input name="dob" type="date" value={editDonor.dob} onChange={handleEditChange} required />
            <select name="bloodGroup" value={editDonor.bloodGroup} onChange={handleEditChange}>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <input name="lastDonationDate" type="date" value={editDonor.lastDonationDate} onChange={handleEditChange} />
            <div>
              <button className="btn" type="submit">Save</button>
              <button className="btn ghost" type="button" style={{ marginLeft: 8 }} onClick={() => setEditDonor(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Donation History {selectedDonor && `for ${selectedDonor}`}</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Blood Group</th>
              <th>Collected</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((unit) => (
              <tr key={unit.Unit_Number}>
                <td>{unit.Unit_Number}</td>
                <td>{unit.Blood_Group}</td>
                <td>{unit.Collected_Date ? String(unit.Collected_Date).split('T')[0] : '-'}</td>
                <td>{unit.Expiry_Date ? String(unit.Expiry_Date).split('T')[0] : '-'}</td>
                <td>{unit.Status}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="5">Select a donor to view donation history.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Donors;
