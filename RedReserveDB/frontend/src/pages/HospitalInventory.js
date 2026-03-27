import React, { useEffect, useState } from 'react';
import { getInventory } from '../services/api';

const HospitalInventory = () => {
  const [units, setUnits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getInventory({ status: 'Available' });
      setUnits(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    const timer = setInterval(fetchUnits, 20000);
    return () => clearInterval(timer);
  }, []);

  const grouped = units.reduce((acc, unit) => {
    acc[unit.Blood_Group] = (acc[unit.Blood_Group] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">Available Inventory</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="alert" style={{ background: '#e0f2fe', color: '#0369a1' }}>Loading inventory...</div>}
      <div className="grid grid-4">
        {Object.entries(grouped).map(([bg, count]) => (
          <div className="card" key={bg} style={count <= 3 ? { border: '2px solid var(--danger)' } : undefined}>
            <p style={{ color: 'var(--muted)', margin: 0 }}>{bg}</p>
            <h2 style={{ margin: '8px 0 0', color: count <= 3 ? 'var(--danger)' : 'inherit' }}>{count}</h2>
            {count <= 3 && <p style={{ color: 'var(--danger)' }}>Running low</p>}
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Unit Details</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Blood Group</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.Unit_Number}>
                <td>{unit.Unit_Number}</td>
                <td>{unit.Blood_Group}</td>
                <td>{unit.Expiry_Date ? String(unit.Expiry_Date).split('T')[0] : '-'}</td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr>
                <td colSpan="3">No available units at the moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalInventory;
