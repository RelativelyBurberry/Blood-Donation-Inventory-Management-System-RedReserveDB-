import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DonorDashboard from './pages/DonorDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/admin" element={
            <ProtectedRoute allowedRole="Admin"><AdminDashboard /></ProtectedRoute>
        } />
        
        <Route path="/hospital" element={
            <ProtectedRoute allowedRole="Hospital"><HospitalDashboard /></ProtectedRoute>
        } />
        
        <Route path="/donor" element={
            <ProtectedRoute allowedRole="Donor"><DonorDashboard /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;