import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { dashboardSummary } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardSummary();
      setSummary(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const timer = setInterval(fetchSummary, 20000);
    return () => clearInterval(timer);
  }, []);

  const bloodGroups = summary?.byGroup || [];
  const statusData = summary?.requestStatus || [];
  const expiringSoon = summary?.expiringSoon || [];

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">Admin Command Center</h1>
        <span style={{ color: 'var(--muted)' }}>Real-time inventory and request control</span>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="alert" style={{ background: '#e0f2fe', color: '#0369a1' }}>Loading dashboard...</div>}

      <div className="grid grid-4">
        <div className="card">
          <p style={{ color: 'var(--muted)', margin: 0 }}>Total Available Units</p>
          <h2 style={{ margin: '8px 0 0' }}>{summary?.totalAvailable ?? '--'}</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--muted)', margin: 0 }}>Pending Requests</p>
          <h2 style={{ margin: '8px 0 0' }}>
            {statusData.find((s) => s.status === 'Pending')?.total || 0}
          </h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--muted)', margin: 0 }}>Approved Requests</p>
          <h2 style={{ margin: '8px 0 0' }}>
            {statusData.find((s) => s.status === 'Approved')?.total || 0}
          </h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--muted)', margin: 0 }}>Expiring Soon</p>
          <h2 style={{ margin: '8px 0 0' }}>{expiringSoon.length}</h2>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Blood Group Distribution</h3>
          <Doughnut
            data={{
              labels: bloodGroups.map((item) => item.bloodGroup),
              datasets: [
                {
                  data: bloodGroups.map((item) => item.total),
                  backgroundColor: ['#b31217', '#f59e0b', '#0f766e', '#2563eb', '#7c3aed', '#ea580c', '#0ea5e9', '#10b981']
                }
              ]
            }}
          />
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Weekly Fulfillment Trend</h3>
          <div style={{ height: "300px" }}>
          <Bar
            data={{
              labels: (summary?.usageDaily || []).map((item) => String(item.day).split('T')[0]),
              datasets: [
                {
                  label: 'Fulfilled Requests',
                  data: (summary?.usageDaily || []).map((item) => item.total),
                  backgroundColor: '#0f766e'
                }
              ]
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
            height={260}
          />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Expiring Soon Alerts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Blood Group</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {expiringSoon.length === 0 && (
              <tr>
                <td colSpan="3">No expiring units in next 7 days.</td>
              </tr>
            )}
            {expiringSoon.map((unit) => (
              <tr key={unit.Unit_Number}>
                <td>{unit.Unit_Number}</td>
                <td>{unit.Blood_Group}</td>
                <td>{unit.Expiry_Date ? String(unit.Expiry_Date).split('T')[0] : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
