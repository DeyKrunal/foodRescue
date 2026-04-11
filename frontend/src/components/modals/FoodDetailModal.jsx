import React from 'react';
import { X, MapPin, Phone, Clock, Info, AlertTriangle } from 'lucide-react';

const FoodDetailModal = ({ donation, isOpen, onClose, onClaim }) => {
    if (!isOpen || !donation) return null;

    return (
        <div className="modal-overlay animate-fade">
            <div className="modal-content glassmorphism">
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>
                
                <div className="modal-header">
                    <span className={`badge ${donation.status === 'REQUESTED' ? 'badge-requested' : 'badge-available'}`}>
                        {donation.status === 'REQUESTED' ? 'Interest Expressed' : 'Available Food'}
                    </span>
                    <h2>{donation.foodItem}</h2>
                    <p className="quantity">Quantity: {donation.quantity}</p>
                </div>

                <div className="modal-body">
                    <div className="detail-section">
                        <h3><Info size={18} /> Description</h3>
                        <p>{donation.description || "No specific description provided for this listing."}</p>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <h4><Clock size={16} /> Cooking Time</h4>
                            <p>{donation.cookingTime ? new Date(donation.cookingTime).toLocaleString() : "N/A"}</p>
                        </div>
                        <div className="detail-item">
                            <h4><AlertTriangle size={16} /> Best Before</h4>
                            <p>{donation.expiryTime ? new Date(donation.expiryTime).toLocaleString() : "N/A"}</p>
                        </div>
                    </div>

                    <div className="donor-card">
                        <h3>Restaurant Details</h3>
                        <div className="donor-info">
                            <div className="donor-main">
                                <strong>{donation.donor?.name || "Premium Partner"}</strong>
                                <p><MapPin size={14} /> {donation.donor?.address || "Location available after claim"}</p>
                            </div>
                            <div className="donor-contact">
                                <p><Phone size={14} /> {donation.donor?.mobileNumber || "Contact hidden"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="interest-logic">
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ✨ {donation.viewCount} other NGOs in your area have viewed this listing.
                        </p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={() => onClaim(donation.id)} style={{ flex: 2 }}>
                        {donation.status === 'REQUESTED' ? 'Send Another Request' : 'Express Interest'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodDetailModal;
