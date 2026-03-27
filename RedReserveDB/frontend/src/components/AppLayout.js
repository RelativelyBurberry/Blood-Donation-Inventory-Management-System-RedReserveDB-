import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const role = user?.role;
  const links = [];

  if (role === 'Admin') {
    links.push(
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/inventory', label: 'Inventory' },
      { to: '/admin/requests', label: 'Requests' },
      { to: '/admin/donors', label: 'Donors' }
    );
  }

  if (role === 'Hospital') {
    links.push(
      { to: '/hospital/requests', label: 'Requests' },
      { to: '/hospital/inventory', label: 'Inventory' }
    );
  }

  if (role === 'Donor') {
    links.push(
      { to: '/donor/profile', label: 'Profile' }
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2>RedReserveDB</h2>
          <p style={{ margin: '6px 0 0', color: '#cbd5f5', fontSize: 12 }}>
            {role || 'Guest'}
          </p>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
