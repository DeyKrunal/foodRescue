import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const dashboardPath = user ? (
    user.role === 'DONOR' ? '/donor/dashboard' :
      user.role === 'NGO' ? '/ngo/dashboard' : '/admin/dashboard'
  ) : '/';

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>FoodRescue</h2>
          </Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/about">Our Mission</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          {user && <li><Link to={dashboardPath} style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Dashboard</Link></li>}
          {user && user.role === 'DONOR' && <li><Link to="/donate-food">Donate</Link></li>}
          {user && user.role === 'NGO' && <li><Link to="/rescue-food">Rescue</Link></li>}
        </ul>
        <div className="auth-btns" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in</Link>
              <Link to="/register" className="btn btn-primary">Join the movement</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
