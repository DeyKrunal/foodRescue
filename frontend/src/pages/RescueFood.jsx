import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableDonations, getDonationsNearMe, createRequest } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RescueFood = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLocal, setIsLocal] = useState(false);
    const navigate = useNavigate();

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const userString = sessionStorage.getItem('user');
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
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user || user.role !== 'NGO') {
            navigate('/login');
        } else {
            fetchDonations();
        }
    }, [navigate]);

    const handleClaim = async (id) => {
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        const message = prompt("Add a message for the donor (optional):", "We'd like to rescue this food.");

        if (message === null) return; // Cancelled

        try {
            await createRequest({
                donation: { id: id },
                ngo: { id: user.id },
                message: message
            });
            alert('Request sent successfully! The donor will review it.');
            fetchDonations();
        } catch (err) {
            alert(err.response?.data || 'Failed to send request.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '80px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ marginBottom: '8px' }}>Available for Rescue</h1>
                        {isLocal ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontSize: '0.95rem', fontWeight: '500' }}>
                                <span>📍 Showing food within 30km of your area</span>
                                <button className="btn-text" onClick={() => setIsLocal(false)} style={{ fontSize: '0.85rem' }}>(Show all)</button>
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
                            <div key={donation.id} className="food-card animate-fade">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <span className="badge badge-available">Available</span>
                                    <small style={{ color: 'var(--text-muted)' }}>{new Date(donation.createdAt).toLocaleDateString()}</small>
                                </div>
                                <h3>{donation.foodItem}</h3>
                                <p style={{ fontWeight: '600', color: 'var(--primary-color)', marginBottom: '12px' }}>Quantity: {donation.quantity}</p>
                                <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>{donation.description || "No additional details provided."}</p>
                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}><strong>Donor:</strong> {donation.donor?.name || "Anonymous Donor"}</p>
                                    <button
                                        onClick={() => handleClaim(donation.id)}
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                    >
                                        Claim & Rescue
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
            </div>
            <Footer />
        </>
    );
};

export default RescueFood;
