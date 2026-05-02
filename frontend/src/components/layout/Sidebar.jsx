import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Heart, 
    PlusCircle, 
    History, 
    Users, 
    Search, 
    LogOut,
    Truck
} from 'lucide-react';
import { logoutUser } from '../../services/api';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const donorLinks = [
        { name: 'Overview', path: '/donor/dashboard', icon: LayoutDashboard },
        { name: 'My Donations', path: '/donor/donations', icon: History },
        { name: 'Add Donation', path: '/donate-food', icon: PlusCircle },
        { name: 'NGO Requests', path: '/donor/requests', icon: Heart },
    ];

    const ngoLinks = [
        { name: 'Browse Food', path: '/rescue-food', icon: Search },
        { name: 'My Requests', path: '/ngo/dashboard', icon: Heart },
        { name: 'History', path: '/ngo/history', icon: History },
        { name: 'Volunteers', path: '/dashboard/ngo/volunteers', icon: Users },
    ];

    const adminLinks = [
        { name: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Users', path: '/admin/users', icon: Users },
        { name: 'All Donations', path: '/admin/donations', icon: Heart },
    ];

    const volunteerLinks = [
        { name: 'My Tasks', path: '/volunteer/dashboard', icon: Truck },
    ];

    const getLinks = () => {
        switch (role) {
            case 'ADMIN': return adminLinks;
            case 'DONOR': return donorLinks;
            case 'NGO': return ngoLinks;
            case 'VOLUNTEER': return volunteerLinks;
            default: return [];
        }
    };

    const links = getLinks();

    const handleLogout = async () => {
        console.log('Logout initiated...');
        try {
            await logoutUser();
            console.log('Logout API call successful');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Fallback: clear local storage anyway
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>Dashboard</h3>
            </div>
            <nav className="sidebar-nav">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            <Icon size={18} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="sidebar-footer">
                <button type="button" onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
