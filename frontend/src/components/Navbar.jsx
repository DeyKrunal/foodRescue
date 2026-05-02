import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { getUnreadCount, getNotifications, markAllNotificationsAsRead } from "../services/api";
import { Bell, Info, CheckCircle, AlertTriangle, MessageSquare, Clock } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        try {
          const res = await getUnreadCount(user.id);
          setUnreadCount(res.data);
        } catch (err) {
          console.error("Failed to fetch unread count", err);
        }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000); // Polling every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(user.id);
      setNotifications(res.data);
      setShowNotifications(!showNotifications);
      // Mark all as read when opening
      if (!showNotifications) {
        await markAllNotificationsAsRead(user.id);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  const dashboardPath = user
    ? user.role === "DONOR"
      ? "/donor/dashboard"
      : user.role === "NGO"
        ? "/ngo/dashboard"
        : user.role === "VOLUNTEER"
          ? "/volunteer/dashboard"
          : "/admin/dashboard"
    : "/";

  const roleLabel = user?.role === "DONOR" ? "🏪 Donor" :
    user?.role === "NGO" ? "🤝 NGO" :
      user?.role === "VOLUNTEER" ? "🛵 Volunteer" :
        "⚙️ Admin";
  const roleColor = user?.role === "DONOR" ? "#1a4d6e" :
    user?.role === "NGO" ? "#2d6a4f" :
      user?.role === "VOLUNTEER" ? "#e67e22" :
        "#7a3d9e";
  const roleBg = user?.role === "DONOR" ? "#e8f4fb" :
    user?.role === "NGO" ? "#e8f5ee" :
      user?.role === "VOLUNTEER" ? "#fdf2e9" :
        "#f3e8fb";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: rgba(250,248,243,0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #e6efe2;
          transition: box-shadow 0.3s ease;
        }

        .nav-root.nav-scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }

        .nav-inner {
          max-width: 1160px;
          margin: auto;
          padding: 0 40px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ── Original Logo ── */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-weight: bold;
          font-size: 20px;
          color: #2f6027;
          flex-shrink: 0;
        }

        /* ── Nav links ── */
        .nav-links {
          display: flex;
          list-style: none;
          gap: 4px;
          margin: 0; padding: 0;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 500;
          color: #3d5438;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .nav-links a:hover {
          background: #edf6e8;
          color: #2f6027;
        }

        .nav-links a.active-link {
          background: #e0f0d8;
          color: #2f6027;
          font-weight: 600;
        }

        .nav-links a.dashboard-link {
          color: #fff !important;
          background: #2f6027;
          font-weight: 600;
          padding: 8px 18px;
          box-shadow: 0 3px 10px rgba(47,96,39,0.25);
          transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
        }

        .nav-links a.dashboard-link:hover {
          background: #245020;
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(47,96,39,0.32);
        }

        /* ── Auth area ── */
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Role badge */
        .nav-role-badge {
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 11px;
          border-radius: 100px;
          letter-spacing: 0.03em;
        }

        /* User chip */
        .nav-user-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 13px 5px 5px;
          background: #f3f9ef;
          border: 1px solid #c8dcc2;
          border-radius: 100px;
          font-size: 13.5px;
          font-weight: 500;
          color: #2a4025;
        }

        .nav-avatar {
          width: 26px; height: 26px;
          background: #3d7a32;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11.5px;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Sign out */
        .btn-logout {
          border: none;
          background: none;
          cursor: pointer;
          padding: 7px 12px;
          border-radius: 100px;
          color: #7a9070;
          font-size: 13.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          transition: background 0.2s, color 0.2s;
        }
        .btn-logout:hover {
          background: #fde8e8;
          color: #c0392b;
        }

        /* ── Sign in button ── */
        .btn-signin {
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          color: #3d5438;
          border: 1.5px solid #c4ddb8;
          background: transparent;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.18s;
          white-space: nowrap;
        }
        .btn-signin:hover {
          background: #edf6e8;
          border-color: #3d7a32;
          color: #2f6027;
          transform: translateY(-1px);
        }

        /* ── Join the Movement ── */
        .btn-join {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #fff;
          background: linear-gradient(135deg, #d4944a 0%, #e8a84a 100%);
          box-shadow: 0 4px 16px rgba(212,148,74,0.38);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        .btn-join::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
          border-radius: inherit;
        }
        .btn-join:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212,148,74,0.50);
        }
        .btn-join:active {
          transform: translateY(0);
        }
        .btn-join-dot {
          width: 7px; height: 7px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          flex-shrink: 0;
          animation: joinDotPulse 1.8s ease-in-out infinite;
        }
        @keyframes joinDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.55); }
        }

        /* ── Divider ── */
        .nav-sep {
          width: 1px;
          height: 20px;
          background: #dce8d6;
          flex-shrink: 0;
        }

        /* ── Hamburger ── */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px; height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .nav-hamburger:hover { background: #edf6e8; }
        .nav-hamburger span {
          display: block;
          width: 100%; height: 2px;
          background: #3d7a32;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile Drawer ── */
        .nav-drawer {
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: rgba(250,248,243,0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid #e6efe2;
          box-shadow: 0 16px 40px rgba(0,0,0,0.09);
          padding: 16px 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transform: translateY(-110%);
          opacity: 0;
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s;
          pointer-events: none;
          z-index: 999;
        }
        .nav-drawer.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        .drawer-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #3d5438;
          transition: background 0.18s;
        }
        .drawer-link:hover, .drawer-link.active-link {
          background: #edf6e8;
          color: #2f6027;
        }
        .drawer-link-icon {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: #edf6e8;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .drawer-sep {
          height: 1px;
          background: #e6efe2;
          margin: 8px 4px;
        }

        /* Logged-in user row in drawer */
        .drawer-user-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: #f3f9ef;
          border: 1px solid #c8dcc2;
          border-radius: 14px;
          margin-bottom: 6px;
        }
        .drawer-user-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .drawer-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #3d7a32;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          font-weight: 700;
        }
        .drawer-name { font-weight: 600; font-size: 14px; color: #2a4025; }
        .drawer-role { font-size: 12px; color: #7a9070; margin-top: 1px; }

        .drawer-signout {
          border: none;
          background: #fde8e8;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: #c0392b;
          padding: 6px 13px;
          border-radius: 100px;
          transition: background 0.2s;
        }
        .drawer-signout:hover { background: #fbd5d5; }

        /* Drawer auth buttons */
        .drawer-auth {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 6px;
        }
        .drawer-signin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          padding: 13px;
          border: 1.5px solid #c4ddb8;
          color: #2f6027;
          font-weight: 600;
          font-size: 14.5px;
          border-radius: 12px;
          background: transparent;
          transition: background 0.2s;
        }
        .drawer-signin-btn:hover { background: #edf6e8; }

        .drawer-join-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #d4944a 0%, #e8a84a 100%);
          box-shadow: 0 4px 18px rgba(212,148,74,0.32);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .drawer-join-btn:hover {
          transform: scale(1.01);
          box-shadow: 0 6px 22px rgba(212,148,74,0.42);
        }


        .nav-notification-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-bell-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #3d5438;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: background 0.2s;
        }

        .nav-bell-btn:hover {
          background: #edf6e8;
        }

        .nav-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #e67e22;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }

        .nav-notification-dropdown {
          position: absolute;
          top: 48px;
          right: 0;
          width: 320px;
          background: #fff;
          border: 1px solid #e6efe2;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          z-index: 1001;
          overflow: hidden;
        }

        .notif-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e6efe2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fdfdfd;
        }

        .notif-header h4 { margin: 0; font-size: 14px; }
        .notif-header button { background: none; border: none; cursor: pointer; color: #7a9070; }

        .notif-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .notif-item {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f9ef;
          transition: background 0.2s;
        }

        .notif-item:hover { background: #f9fdf7; }
        .notif-item.unread { background: #f3f9ef; }
        .notif-item-content { display: flex; gap: 12px; }
        .notif-icon-wrapper { flex-shrink: 0; margin-top: 2px; }
        .notif-text-wrapper { flex: 1; }
        .notif-item p { margin: 0 0 4px; font-size: 13.5px; color: #2a4025; line-height: 1.4; }
        .notif-time { font-size: 11px; color: #7a9070; display: flex; align-items: center; gap: 4px; }
        .no-notif { padding: 32px; text-align: center; color: #7a9070; font-size: 14px; }

        @media (max-width: 900px) {
          .nav-links, .nav-auth, .nav-sep { display: none; }
          .nav-hamburger { display: flex; }
          .nav-inner { padding: 0 20px; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`nav-root ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">

          {/* Original Logo */}
          <Link to="/" className="nav-logo">
            🌿 MealMitra
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <Link to="/about" className={isActive("/about") ? "active-link" : ""}>
                Our Mission
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className={isActive("/how-it-works") ? "active-link" : ""}>
                How It Works
              </Link>
            </li>
            {user && (
              <li>
                <Link to={dashboardPath} className="dashboard-link">
                  Dashboard
                </Link>
              </li>
            )}
            {user?.role === "VOLUNTEER" && (
              <li>
                <Link to="/volunteer/dashboard" className={isActive("/volunteer/dashboard") ? "active-link" : ""}>
                  Missions
                </Link>
              </li>
            )}
            {user?.role === "DONOR" && (
              <li>
                <Link to="/donate-food" className={isActive("/donate-food") ? "active-link" : ""}>
                  Donate
                </Link>
              </li>
            )}
            {user?.role === "NGO" && (
              <li>
                <Link to="/rescue-food" className={isActive("/rescue-food") ? "active-link" : ""}>
                  Rescue
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop Auth */}
          <div className="nav-auth">
            {user ? (
              <>
                <span
                  className="nav-role-badge"
                  style={{ color: roleColor, background: roleBg }}
                >
                  {roleLabel}
                </span>

                {/* Notification Bell */}
                <div className="nav-notification-container">
                  <button className="nav-bell-btn" onClick={fetchNotifications}>
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                  </button>

                  {showNotifications && (
                    <div className="nav-notification-dropdown animate-fade">
                      <div className="notif-header">
                        <h4>Notifications</h4>
                        <button onClick={() => setShowNotifications(false)}>✕</button>
                      </div>
                      <div className="notif-list">
                        {notifications.length > 0 ? notifications.map(n => {
                          const Icon = n.type === 'SUCCESS' ? CheckCircle :
                            n.type === 'ALERT' ? AlertTriangle :
                              n.type === 'REQUEST' ? MessageSquare : Info;
                          const iconColor = n.type === 'SUCCESS' ? '#27ae60' :
                            n.type === 'ALERT' ? '#e74c3c' :
                              n.type === 'REQUEST' ? '#3498db' : '#7f8c8d';

                          return (
                            <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                              <div className="notif-item-content">
                                <div className="notif-icon-wrapper">
                                  <Icon size={18} color={iconColor} />
                                </div>
                                <div className="notif-text-wrapper">
                                  <p>{n.message}</p>
                                  <span className="notif-time">
                                    <Clock size={10} />
                                    {new Date(n.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }) : <p className="no-notif">No notifications yet</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="nav-sep" />
                <div className="nav-user-chip">
                  <div className="nav-avatar">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {user?.name?.split(" ")[0]}
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-signin">
                  Sign in
                </Link>
                <div className="nav-sep" />
                <Link to="/register" className="btn-join">
                  <span className="btn-join-dot" />
                  Join the Movement
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`nav-drawer ${menuOpen ? "open" : ""}`}>

        {user ? (
          <>
            <div className="drawer-user-row">
              <div className="drawer-user-left">
                <div className="drawer-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div className="drawer-name">{user?.name}</div>
                  <div className="drawer-role">{roleLabel}</div>
                </div>
              </div>
              <button className="drawer-signout" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </>
        ) : null}

        <Link to="/about" className={`drawer-link ${isActive("/about") ? "active-link" : ""}`}>
          <span className="drawer-link-icon">🌱</span>
          Our Mission
        </Link>
        <Link to="/how-it-works" className={`drawer-link ${isActive("/how-it-works") ? "active-link" : ""}`}>
          <span className="drawer-link-icon">⚡</span>
          How It Works
        </Link>

        {user && (
          <Link to={dashboardPath} className="drawer-link">
            <span className="drawer-link-icon">📊</span>
            Dashboard
          </Link>
        )}
        {user?.role === "DONOR" && (
          <Link to="/donate-food" className={`drawer-link ${isActive("/donate-food") ? "active-link" : ""}`}>
            <span className="drawer-link-icon">🍱</span>
            Donate Food
          </Link>
        )}
        {user?.role === "NGO" && (
          <Link to="/rescue-food" className={`drawer-link ${isActive("/rescue-food") ? "active-link" : ""}`}>
            <span className="drawer-link-icon">🤝</span>
            Rescue Food
          </Link>
        )}
        {user?.role === "VOLUNTEER" && (
          <Link to="/volunteer/dashboard" className={`drawer-link ${isActive("/volunteer/dashboard") ? "active-link" : ""}`}>
            <span className="drawer-link-icon">🛵</span>
            Delivery Missions
          </Link>
        )}

        {!user && (
          <>
            <div className="drawer-sep" />
            <div className="drawer-auth">
              <Link to="/login" className="drawer-signin-btn">
                Sign in
              </Link>
              <Link to="/register" className="drawer-join-btn">
                🌿 Join the Movement
              </Link>
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default Navbar;
