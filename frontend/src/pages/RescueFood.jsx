import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableDonations, getDonationsNearMe, createRequest } from '../services/api';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import FoodDetailModal from '../components/modals/FoodDetailModal';
import Swal from 'sweetalert2';

const RescueFood = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLocal, setIsLocal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            // Use NGO's stored location if available for proximity matching.
            if (user?.location && user.location.length === 2) {
                const [lon, lat] = user.location;
                const res = await getDonationsNearMe(lon, lat);
                setDonations(res.data);
                setIsLocal(true);
            } else {
                const res = await getAvailableDonations();
                setDonations(res.data);
                setIsLocal(false);
            }
        } catch (err) {
            console.error("Failed to fetch donations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user || user.role !== 'NGO') {
            navigate('/login');
        } else if (!user.verified) {
            Swal.fire({
                icon: 'warning',
                title: 'Approval Pending',
                text: 'Your NGO account is pending admin approval. You cannot rescue food yet.',
                confirmButtonColor: 'var(--primary-color)'
            }).then(() => navigate('/ngo/dashboard'));
        } else {
            fetchDonations();
        }
    }, [navigate]);

    const handleClaim = async (id) => {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        const { value: message } = await Swal.fire({
            title: 'Rescue Message',
            input: 'textarea',
            inputLabel: 'Add a message for the donor (optional)',
            inputValue: "We'd like to rescue this food.",
            showCancelButton: true,
            confirmButtonColor: 'var(--primary-color)',
            confirmButtonText: 'Send Request',
            inputValidator: (value) => {
                if (!value && value !== "") {
                    return 'You need to write something!'
                }
            }
        });

        if (!message && message !== "") return;

        try {
            await createRequest({
                donation: { id: id },
                ngo: { id: user.id },
                message: message
            });
            
            setIsModalOpen(false);
            
            await Swal.fire({
                icon: 'success',
                title: 'Sent!',
                text: 'Request sent successfully! The donor will review it.',
                confirmButtonColor: 'var(--primary-color)'
            });
            
            fetchDonations();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data || 'Failed to send request.',
                confirmButtonColor: '#D32F2F'
            });
        }
    };

    const openModal = async (donation) => {
        setSelectedDonation(donation);
        setIsModalOpen(true);
        try {
            await api.post(`/donations/${donation.id}/view`);
        } catch (err) {
            console.error("Failed to increment view count", err);
        }
    };

    return (
        <DashboardLayout role="NGO">
            <div className="animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ marginBottom: '8px' }}>Available for Rescue</h1>
                        {isLocal ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontSize: '0.95rem', fontWeight: '500' }}>
                                <span>📍 Showing food within 30km of your area</span>
                                <button className="btn-text" onClick={() => setIsLocal(false)} style={{ fontSize: '0.85rem', marginLeft: '8px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary-color)', textDecoration: 'underline' }}>(Show all)</button>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Showing all active surplus food listings across the platform.</p>
                        )}
                    </div>
                </div>

                {loading ? (
                    <p>Loading available food...</p>
                ) : (
                    <div className="listing-grid">
                        {donations.length > 0 ? donations.map(donation => (
                            <div 
                                key={donation.id} 
                                className="food-card animate-fade clickable-card"
                                onClick={() => openModal(donation)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <span className={`badge ${donation.status === 'REQUESTED' ? 'badge-requested' : 'badge-available'}`}>
                                        {donation.status === 'REQUESTED' ? 'Requested' : 'Available'}
                                    </span>
                                    <small style={{ color: 'var(--text-muted)' }}>{new Date(donation.createdAt).toLocaleDateString()}</small>
                                </div>
                                <h3>{donation.foodItem}</h3>
                                <p style={{ fontWeight: '600', color: 'var(--primary-color)', marginBottom: '12px' }}>Quantity: {donation.quantity}</p>
                                <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>{donation.description || "No additional details provided."}</p>
                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}><strong>Donor:</strong> {donation.donor?.name || "Anonymous Donor"}</p>
                                    <button
                                        onClick={() => openModal(donation)}
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }}>
                                No food listings available at the moment. Check back soon!
                            </p>
                        )}
                    </div>
                )}

                <FoodDetailModal 
                    donation={selectedDonation}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onClaim={handleClaim}
                />
            </div>
        </DashboardLayout>
    );
};

export default RescueFood;
