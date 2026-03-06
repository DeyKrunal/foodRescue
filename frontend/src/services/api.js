import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

//  const url = 'https://65c1c8521610.ngrok-free.app';
//  const API_BASE_URL = `${url}/api`;


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getImpactStats = () => api.get('/public/impact-stats');
export const getTestimonials = () => api.get('/public/testimonials');
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// Donations
export const getAvailableDonations = () => api.get('/donations/available');
export const getDonationsNearMe = (lon, lat) => api.get(`/donations/near-me?lon=${lon}&lat=${lat}`);
export const createDonation = (donationData) => api.post('/donations/create', donationData);
export const claimDonation = (id) => api.post(`/donations/${id}/claim`);

// Requests
export const createRequest = (requestData) => api.post('/requests/create', requestData);
export const getNgoRequests = (ngoId) => api.get(`/requests/ngo/${ngoId}`);

export default api;
