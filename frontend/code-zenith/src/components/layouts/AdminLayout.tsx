import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Clock,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Bell,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard',           icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/employees',           icon: Users,           label: 'Employees' },
    { path: '/admin/attendance',          icon: Calendar,        label: 'Attendance' },
    { path: '/admin/leaves',              icon: FileText,        label: 'Leaves' },
    { path: '/admin/shifts',              icon: Clock,           label: 'Shifts' },
    { path: '/admin/reports/attendance',  icon: BarChart3,       label: 'Reports' },
    { path: '/admin/settings',            icon: Settings,        label: 'Settings' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="aura-bg" style={{ minHeight: '100vh' }}>
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Building2 size={22} />
          </div>
          <div className="sidebar-logo-text">
            <div className="brand">CodeZenith</div>
            <div className="subtitle">HR System</div>
          </div>
          <button
            className="btn btn-link p-0 d-lg-none ms-auto"
            style={{ color: 'var(--af-on-surface-variant)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}

          <div className="sidebar-section-label mt-2">Account</div>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <User size={18} />
            My Profile
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-user w-100 border-0 bg-transparent text-start"
            onClick={handleLogout}
            style={{ gap: '0.625rem' }}
          >
            <div
              className="avatar avatar-sm avatar-red"
              style={{ fontSize: '0.75rem' }}
            >
              {initials}
            </div>
            <div className="flex-grow-1 min-w-0" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--af-on-surface)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--af-on-surface-variant)',
                  fontFamily: 'var(--font-label)',
                  textTransform: 'capitalize',
                }}
              >
                {user?.role}
              </div>
            </div>
            <LogOut size={16} style={{ color: 'var(--af-on-surface-variant)', flexShrink: 0 }} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <button
            className="btn btn-link p-0 me-3 d-lg-none"
            style={{ color: 'var(--af-on-surface)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Page breadcrumb / title area */}
          <div className="d-none d-lg-flex align-items-center" style={{ flex: 1 }}>
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--af-on-surface-variant)',
                fontFamily: 'var(--font-label)',
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}
            >
              ADMIN PANEL
            </span>
          </div>

          <div className="ms-auto d-flex align-items-center gap-3">
            {/* Notification bell */}
            <button
              className="btn btn-link p-0"
              style={{ color: 'var(--af-on-surface-variant)', position: 'relative' }}
            >
              <Bell size={20} />
            </button>

            {/* User dropdown */}
            <div className="position-relative">
              <button
                className="d-flex align-items-center gap-2 border-0 bg-transparent p-0"
                style={{ cursor: 'pointer' }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="avatar avatar-sm avatar-red" style={{ fontSize: '0.75rem' }}>
                  {initials}
                </div>
                <div className="d-none d-md-block text-start" style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--af-on-surface)' }}>
                    {user?.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--af-on-surface-variant)',
                      fontFamily: 'var(--font-label)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {user?.role}
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  style={{ color: 'var(--af-on-surface-variant)', transition: 'transform 150ms' }}
                />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div
                    className="dropdown-menu show"
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 1000 }}
                  >
                    <span className="dropdown-item-text">
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--af-on-surface)' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>
                        {user?.email}
                      </div>
                    </span>
                    <div className="dropdown-divider" />
                    <NavLink
                      to="/admin/profile"
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={15} className="me-2" />
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/admin/change-password"
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={15} className="me-2" />
                      Change Password
                    </NavLink>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item text-danger d-flex align-items-center"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} className="me-2" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '1.5rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
