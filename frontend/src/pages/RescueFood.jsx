import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableDonations, createRequest } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RescueFood = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDonations = async () => {
        try {
            const res = await getAvailableDonations();
            setDonations(res.data);
        } catch (err) {
            console.error("Failed to fetch donations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'NGO') {
            navigate('/login');
        } else {
            fetchDonations();
        }
    }, [navigate]);

    const handleClaim = async (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
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
                <h1 style={{ marginBottom: '16px' }}>Available for Rescue</h1>
                <p style={{ marginBottom: '40px' }}>Claim surplus food listings from local donors. Ensure you have the capacity for immediate pickup.</p>

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
