import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { checkSession } from '../../services/api';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { getCurrentUser } from '../../services/api';

const DashboardLayout = ({ children, role }) => {
    const navigate = useNavigate();
    let user = null;
    try {
        const userString = sessionStorage.getItem('user');
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        console.error("Failed to parse user from sessionStorage", e);
        sessionStorage.removeItem('user');
    }

    useEffect(() => {
        if (!user) return; // Navigate handles initial redirect

        // Background server session validation
        const validateSession = async () => {
            try {
                await checkSession();
            } catch (err) {
                console.error("Session invalid on server", err);
                sessionStorage.removeItem('user');
                navigate('/login');
            }
        };

        validateSession();
    }, [user, navigate]);

    // Immediate Redirection Guards
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="dashboard-container" style={{ flex: 1, display: 'flex', background: '#f8fafc', paddingTop: '68px' }}>
                <Sidebar role={user.role} />
                <main className="dashboard-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '1200px', margin: '35px auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
