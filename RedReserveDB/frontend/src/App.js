import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Inventory from './pages/Inventory';
import Requests from './pages/Requests';
import Donors from './pages/Donors';
import HospitalInventory from './pages/HospitalInventory';
import DonorProfile from './pages/DonorProfile';
import DataExplorer from './pages/DataExplorer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AppLayout><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/inventory" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AppLayout><Inventory /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/requests" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AppLayout><Requests /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/donors" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AppLayout><Donors /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/data-explorer" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AppLayout><DataExplorer /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/hospital/requests" element={
          <ProtectedRoute allowedRoles={['Hospital']}>
            <AppLayout><Requests /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/hospital/inventory" element={
          <ProtectedRoute allowedRoles={['Hospital']}>
            <AppLayout><HospitalInventory /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/donor/profile" element={
          <ProtectedRoute allowedRoles={['Donor']}>
            <AppLayout><DonorProfile /></AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
