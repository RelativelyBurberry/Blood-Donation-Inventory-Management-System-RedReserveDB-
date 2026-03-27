import React, { useEffect, useState } from 'react';
import { addInventory, deleteInventory, getInventory, updateInventory } from '../services/api';

const Inventory = () => {
  const [units, setUnits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: 'A+',
    quantity: 1,
    expiryDate: '',
    donorId: '',
    bankId: '',
    collectedDate: ''
  });

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getInventory();
      setUnits(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addInventory(form);
      setForm({ ...form, quantity: 1 });
      fetchUnits();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add inventory.');
    }
  };

  const handleStatusToggle = async (unit) => {
    const nextStatus = unit.Status === 'Available' ? 'Expired' : 'Available';
    try {
      await updateInventory(unit.Unit_Number, { status: nextStatus });
      fetchUnits();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update unit.');
    }
  };

  const handleDelete = async (unitNumber) => {
    try {
      await deleteInventory(unitNumber);
      fetchUnits();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete unit.');
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">Inventory Control</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="alert" style={{ background: '#e0f2fe', color: '#0369a1' }}>Loading inventory...</div>}
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Add Blood Units</h3>
          <form className="form-grid" onSubmit={handleAdd}>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required />
            <input name="expiryDate" type="date" onChange={handleChange} required />
            <input name="donorId" placeholder="Donor ID (optional)" onChange={handleChange} />
            <input name="bankId" placeholder="Bank ID (optional)" onChange={handleChange} />
            <input name="collectedDate" type="date" onChange={handleChange} />
            <button className="btn" type="submit">Add Units</button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Quick Health Check</h3>
          <p style={{ color: 'var(--muted)' }}>Units that are expiring within 7 days will appear in Requests dashboard.</p>
          <p style={{ marginTop: 12 }}>Ensure all newly added units have valid expiry dates and donor tracking.</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Current Inventory</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Donor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => {
              const isLow = unit.Status === 'Available' && unit.Expiry_Date && new Date(unit.Expiry_Date) < new Date(Date.now() + 7 * 86400000);
              return (
                <tr key={unit.Unit_Number} style={isLow ? { background: '#fff1f2' } : undefined}>
                  <td>{unit.Unit_Number}</td>
                  <td>{unit.Blood_Group}</td>
                  <td>{unit.Status}</td>
                  <td>{unit.Expiry_Date ? String(unit.Expiry_Date).split('T')[0] : '-'}</td>
                  <td>{unit.Donor_id || '-'}</td>
                  <td>
                    <button className="btn ghost" type="button" onClick={() => handleStatusToggle(unit)}>
                      Toggle Status
                    </button>
                    <button className="btn ghost" type="button" onClick={() => handleDelete(unit.Unit_Number)} style={{ marginLeft: 8 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {units.length === 0 && (
              <tr>
                <td colSpan="6">No inventory records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
