import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  Bell,
  Clock,
} from 'lucide-react';

export const EmployeeLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/employee/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employee/attendance',      icon: Calendar,        label: 'Attendance' },
    { path: '/employee/attendance/mark', icon: Clock,           label: 'Mark Attendance' },
    { path: '/employee/leaves',          icon: FileText,        label: 'My Leaves' },
    { path: '/employee/profile',         icon: User,            label: 'My Profile' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="aura-bg" style={{ minHeight: '100vh' }}>
      {/* Mobile sidebar overlay */}
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
            <div className="subtitle">HR Portal</div>
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
          <div className="sidebar-section-label">Employee Portal</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/employee/attendance'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}

          {hasRole(['admin', 'hr', 'manager']) && (
            <>
              <div className="sidebar-section-label mt-2">Administration</div>
              <NavLink
                to="/admin/dashboard"
                className="nav-link"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings size={18} />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar avatar-sm avatar-red" style={{ fontSize: '0.75rem' }}>
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
                }}
              >
                {user?.employeeId || user?.role}
              </div>
            </div>
          </div>
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
              EMPLOYEE PORTAL
            </span>
          </div>

          <div className="ms-auto d-flex align-items-center gap-3">
            <button
              className="btn btn-link p-0"
              style={{ color: 'var(--af-on-surface-variant)' }}
            >
              <Bell size={20} />
            </button>

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
                    }}
                  >
                    {user?.employeeId}
                  </div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--af-on-surface-variant)' }} />
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
                      {user?.employeeId && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)', marginTop: 2 }}>
                          {user.employeeId}
                        </div>
                      )}
                    </span>
                    <div className="dropdown-divider" />
                    <NavLink
                      to="/employee/profile"
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={15} className="me-2" />
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/employee/change-password"
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={15} className="me-2" />
                      Change Password
                    </NavLink>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item d-flex align-items-center"
                      style={{ color: 'var(--af-primary)' }}
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
