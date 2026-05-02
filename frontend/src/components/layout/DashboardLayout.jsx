import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { getCurrentUser } from '../../services/api';

const DashboardLayout = ({ children, role }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const checkSession = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                // Verify session with backend
                await getCurrentUser();
                
                if (role && user.role !== role) {
                    navigate('/');
                }
            } catch (err) {
                console.error('Session invalid:', err);
                localStorage.removeItem('user');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [user, navigate, role]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div className="btn-spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--primary-color)' }}></div>
            </div>
        );
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
