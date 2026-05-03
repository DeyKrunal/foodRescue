import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

//  const url = 'https://65c1c8521610.ngrok-free.app';
//  const API_BASE_URL = `${url}/api`;


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const getImpactStats = () => api.get('/public/impact-stats');
export const getTestimonials = () => api.get('/public/testimonials');
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const verifyEmail = (email, code) => api.post('/auth/verify', { email, code });
export const resendCode = (email) => api.post('/auth/resend-code', { email });
export const checkSession = () => api.get('/auth/me');
export const getCurrentUser = () => api.get('/auth/me');
export const logoutUser = () => api.post('/auth/logout');

// Notifications
export const getNotifications = (userId) => api.get(`/notifications/user/${userId}`);
export const getUnreadCount = (userId) => api.get(`/notifications/user/${userId}/unread-count`);
export const markAllNotificationsAsRead = (userId) => api.post(`/notifications/user/${userId}/read-all`);

// Donations
export const getAvailableDonations = () => api.get('/donations/available');
export const getDonationsNearMe = (lon, lat) => api.get(`/donations/near-me?lon=${lon}&lat=${lat}`);
export const createDonation = (donationData) => api.post('/donations/create', donationData);
export const claimDonation = (id) => api.post(`/donations/${id}/claim`);

// Requests
export const createRequest = (requestData) => api.post('/requests/create', requestData);
export const getNgoRequests = (ngoId) => api.get(`/requests/ngo/${ngoId}`);

// Volunteers & Deliveries
export const getAvailableDeliveries = (ngoId) => api.get(`/deliveries/available?ngoId=${ngoId}`);
export const getDonorDeliveries = (donorId) => api.get(`/deliveries/donor/${donorId}`);
export const getNgoDeliveries = (ngoId) => api.get(`/deliveries/ngo/${ngoId}`);
export const getMyTasks = (volunteerId) => api.get(`/deliveries/my-tasks/${volunteerId}`);
export const getDeliveryDetails = (id) => api.get(`/deliveries/${id}`);
export const assignDelivery = (id, volunteerId) => api.post(`/deliveries/${id}/assign`, { volunteerId });
export const verifyPickupOtp = (id, otp) => api.post(`/deliveries/${id}/verify-otp`, { otp });
export const ngoVerifyDelivery = (id) => api.post(`/deliveries/${id}/ngo-verify`);
export const trackDelivery = (id, coordinates) => api.post(`/deliveries/${id}/track`, coordinates);
export const completeDelivery = (id) => api.post(`/deliveries/${id}/complete`);

export const getNgoVolunteers = (ngoId) => api.get(`/volunteers/ngo/${ngoId}`);
export const approveVolunteer = (id) => api.post(`/volunteers/${id}/approve`);
export const rejectVolunteer = (id) => api.post(`/volunteers/${id}/reject`);

// Admin
export const getAllUsers = () => api.get('/admin/users');
export const verifyPartner = (id) => api.post(`/admin/users/${id}/verify`);

// User / Profile
export const updateUserProfile = (id, userData) => api.put(`/users/${id}`, userData);

export default api;
