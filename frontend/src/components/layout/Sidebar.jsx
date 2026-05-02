import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    History,
    Users,
    Truck,
    Search,
    List,
    UserCircle,
    ShieldCheck,
    FileText
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const donorLinks = [
        { name: 'Overview', path: '/donor/dashboard', icon: LayoutDashboard },
        { name: 'My Donations', path: '/donor/donations', icon: List },
        { name: 'Add Donation', path: '/donate-food', icon: PlusCircle },
        { name: 'NGO Requests', path: '/donor/requests', icon: FileText },
        { name: 'My Profile', path: '/profile', icon: UserCircle },
    ];

    const ngoLinks = [
        { name: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
        { name: 'Rescue Food', path: '/rescue-food', icon: Search },
        { name: 'Request History', path: '/ngo/history', icon: History },
        { name: 'Manage Volunteers', path: '/dashboard/ngo/volunteers', icon: Users },
        { name: 'My Profile', path: '/profile', icon: UserCircle },
    ];

    const volunteerLinks = [
        { name: 'Overview', path: '/volunteer/dashboard', icon: LayoutDashboard },
        { name: 'Active Deliveries', path: '/volunteer/dashboard', icon: Truck },
        { name: 'My Profile', path: '/profile', icon: UserCircle },
    ];

    const adminLinks = [
        { name: 'System Stats', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Partner Verification', path: '/admin/users', icon: ShieldCheck },
        { name: 'Donation Audit', path: '/admin/donations', icon: List },
        { name: 'My Profile', path: '/profile', icon: UserCircle },
    ];

    const links = role === 'DONOR' ? donorLinks :
        role === 'NGO' ? ngoLinks :
            role === 'VOLUNTEER' ? volunteerLinks :
                adminLinks;

    return (
        <aside className="sidebar" style={{
            width: '260px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="sidebar-header" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Menu
                </h3>
            </div>
            <nav className="sidebar-nav" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name + link.path}
                            to={link.path}
                            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                color: location.pathname === link.path ? 'var(--primary-color)' : '#475569',
                                background: location.pathname === link.path ? 'color-mix(in srgb, var(--primary-color) 8%, transparent)' : 'transparent',
                                fontWeight: location.pathname === link.path ? '600' : '500',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Icon size={18} />
                            {link.name}
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
