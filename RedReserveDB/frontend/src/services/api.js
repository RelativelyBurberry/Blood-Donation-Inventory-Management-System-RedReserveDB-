import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerDonor = (donorData) => API.post('/donors/register', donorData);
export const requestBlood = (requestData) => API.post('/requests/new', requestData);
export const executeQuery = (queryId) => API.get('/queries/execute/' + queryId);
export default API;