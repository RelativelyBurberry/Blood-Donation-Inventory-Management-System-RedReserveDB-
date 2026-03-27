import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerDonor = (payload) => API.post('/auth/register/donor', payload);
export const registerHospital = (payload) => API.post('/auth/register/hospital', payload);
export const getMe = () => API.get('/auth/me');

export const getInventory = (params) => API.get('/inventory', { params });
export const addInventory = (payload) => API.post('/inventory', payload);
export const updateInventory = (unitNumber, payload) => API.put(`/inventory/${unitNumber}`, payload);
export const deleteInventory = (unitNumber) => API.delete(`/inventory/${unitNumber}`);
export const inventorySummary = () => API.get('/inventory/summary');

export const getRequests = (params) => API.get('/requests', { params });
export const getHospitalRequests = () => API.get('/requests/hospital');
export const createRequest = (payload) => API.post('/requests', payload);
export const approveRequest = (requestId) => API.post(`/requests/${requestId}/approve`);
export const rejectRequest = (requestId) => API.post(`/requests/${requestId}/reject`);
export const fulfillRequest = (requestId) => API.post(`/requests/${requestId}/fulfill`);

export const getDonors = () => API.get('/donors');
export const updateDonor = (donorId, payload) => API.put(`/donors/${donorId}`, payload);
export const deleteDonor = (donorId) => API.delete(`/donors/${donorId}`);
export const donorHistory = (donorId) => API.get(`/donors/${donorId}/history`);

export const getHospitals = () => API.get('/hospitals');

export const dashboardSummary = () => API.get('/dashboard/summary');

export default API;
