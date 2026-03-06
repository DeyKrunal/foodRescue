import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const dashboardPath = user ? (
    user.role === 'DONOR' ? '/donor/dashboard' :
    user.role === 'NGO'   ? '/ngo/dashboard'  : '/admin/dashboard'
  ) : '/';

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 0 40px;
        }
        .nav-root.nav-scrolled {
          background: rgba(250, 248, 243, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(184, 217, 160, 0.45);
          box-shadow: 0 4px 24px rgba(61,122,50,0.07);
        }
        .nav-root:not(.nav-scrolled) {
          background: transparent;
        }

        .nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        /* ── Logo ── */
        .nav-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 34px; height: 34px;
          background: #3d7a32;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          line-height: 1;
          box-shadow: 0 3px 12px rgba(61,122,50,0.28);
          transition: transform 0.2s;
        }
        .nav-logo:hover .nav-logo-icon { transform: rotate(-6deg) scale(1.08); }
        .nav-logo-text {
          font-family: 'Fraunces', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #1c2b1a;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .nav-logo-text span {
          font-style: italic;
          font-weight: 400;
          color: #3d7a32;
        }

        /* ── Nav links ── */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-links li a {
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 500;
          color: #3d5438;
          text-decoration: none;
          padding: 7px 13px;
          border-radius: 100px;
          transition: background 0.18s, color 0.18s;
          position: relative;
          display: block;
        }
        .nav-links li a:hover {
          background: #edf6e8;
          color: #2f6027;
        }
        .nav-links li a.active-link {
          background: #e0f0d8;
          color: #2f6027;
          font-weight: 600;
        }
        /* Dashboard link pill — slightly more prominent */
        .nav-links li a.dashboard-link {
          background: #f0f8ec;
          color: #3d7a32;
          font-weight: 600;
          border: 1px solid #c4ddb8;
        }
        .nav-links li a.dashboard-link:hover {
          background: #e0f0d8;
        }

        /* ── Right side auth ── */
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Greeting chip */
        .nav-greeting {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #5c6b57;
          background: #f3f9ef;
          border: 1px solid #d0e8c4;
          padding: 5px 12px 5px 8px;
          border-radius: 100px;
        }
        .nav-avatar {
          width: 24px; height: 24px;
          background: #3d7a32;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0;
        }

        /* Logout — ghost/text style */
        .btn-logout {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #7a9070;
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 12px;
          border-radius: 100px;
          transition: background 0.18s, color 0.18s;
        }
        .btn-logout:hover {
          background: #fde8e8;
          color: #c0392b;
        }

        /* Sign in link */
        .btn-signin {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #5c6b57;
          text-decoration: none;
          padding: 7px 12px;
          border-radius: 100px;
          transition: background 0.18s, color 0.18s;
        }
        .btn-signin:hover {
          background: #edf6e8;
          color: #2f6027;
        }

        /* ── Join button — the star ── */
        .btn-join {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: #fff;
          background: #3d7a32;
          padding: 9px 20px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 3px 14px rgba(61,122,50,0.28), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-join::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          border-radius: inherit;
        }
        /* Shimmer sweep on hover */
        .btn-join::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0.4s ease;
        }
        .btn-join:hover::after { left: 160%; }
        .btn-join:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 22px rgba(61,122,50,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-join-leaf {
          font-size: 15px;
          transition: transform 0.3s;
        }
        .btn-join:hover .btn-join-leaf { transform: rotate(15deg) scale(1.15); }

        /* ── Hamburger (mobile) ── */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
        }
        .nav-hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: #3d7a32;
          border-radius: 2px;
          transition: all 0.25s;
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .nav-mobile-drawer {
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: rgba(250,248,243,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(184,217,160,0.5);
          padding: 16px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transform: translateY(-8px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.22s, transform 0.22s;
          z-index: 999;
        }
        .nav-mobile-drawer.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        .nav-mobile-drawer a,
        .nav-mobile-drawer button {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #3d5438;
          text-decoration: none;
          padding: 11px 14px;
          border-radius: 10px;
          transition: background 0.15s;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }
        .nav-mobile-drawer a:hover,
        .nav-mobile-drawer button:hover { background: #edf6e8; }
        .nav-mobile-divider {
          height: 1px;
          background: #deecd5;
          margin: 8px 0;
        }

        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-inner { animation: navSlideDown 0.45s ease both; }

        @media (max-width: 768px) {
          .nav-links, .nav-auth { display: none; }
          .nav-hamburger { display: flex; }
          .nav-root { padding: 0 20px; }
        }
      `}</style>

      <nav className={`nav-root${scrolled ? ' nav-scrolled' : ''}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">🌿</div>
            <div className="nav-logo-text">Food<span>Rescue</span></div>
          </Link>

          {/* Center nav links */}
          <ul className="nav-links">
            <li>
              <Link to="/about" className={isActive('/about') ? 'active-link' : ''}>
                Our Mission
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className={isActive('/how-it-works') ? 'active-link' : ''}>
                How It Works
              </Link>
            </li>
            {user && (
              <li>
                <Link to={dashboardPath} className="dashboard-link">
                  ⚡ Dashboard
                </Link>
              </li>
            )}
            {user?.role === 'DONOR' && (
              <li>
                <Link to="/donate-food" className={isActive('/donate-food') ? 'active-link' : ''}>
                  Donate
                </Link>
              </li>
            )}
            {user?.role === 'NGO' && (
              <li>
                <Link to="/rescue-food" className={isActive('/rescue-food') ? 'active-link' : ''}>
                  Rescue
                </Link>
              </li>
            )}
          </ul>

          {/* Right auth section */}
          <div className="nav-auth">
            {user ? (
              <>
                <div className="nav-greeting">
                  <div className="nav-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name.split(' ')[0]}
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-signin">Sign in</Link>
                <Link to="/register" className="btn-join">
                  <span className="btn-join-leaf">🌱</span>
                  Join the movement
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-drawer${menuOpen ? ' open' : ''}`}>
        <Link to="/about">Our Mission</Link>
        <Link to="/how-it-works">How It Works</Link>
        {user && <Link to={dashboardPath}>⚡ Dashboard</Link>}
        {user?.role === 'DONOR' && <Link to="/donate-food">Donate Food</Link>}
        {user?.role === 'NGO'   && <Link to="/rescue-food">Rescue Food</Link>}
        <div className="nav-mobile-divider" />
        {user ? (
          <button onClick={handleLogout}>Sign out</button>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register">🌱 Join the movement</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
