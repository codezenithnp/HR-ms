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
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/employees', icon: Users, label: 'Employees' },
    { path: '/admin/attendance', icon: Calendar, label: 'Attendance' },
    { path: '/admin/leaves', icon: FileText, label: 'Leaves' },
    { path: '/admin/shifts', icon: Clock, label: 'Shifts' },
    { path: '/admin/reports/attendance', icon: BarChart3, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        className={`sidebar bg-white border-end ${sidebarOpen ? '' : 'd-none d-md-block'}`}
        style={{ width: '260px', position: 'fixed', height: '100vh', overflowY: 'auto', zIndex: 1000 }}
      >
        {/* Logo */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div
              className="bg-primary text-white rounded d-flex align-items-center justify-center me-2"
              style={{ width: '40px', height: '40px' }}
            >
              <Building2 size={24} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold">CodeZenith</h5>
              <small className="text-muted">HR System</small>
            </div>
          </div>
          <button
            className="btn btn-link d-md-none p-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="nav flex-column p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 mb-1 rounded ${
                  isActive ? 'active bg-primary bg-opacity-10 text-primary' : 'text-dark'
                }`
              }
            >
              <item.icon size={20} className="me-2" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: sidebarOpen ? '260px' : '0' }}>
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
          <div className="container-fluid">
            <button
              className="btn btn-link text-dark d-md-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>

            <div className="ms-auto d-flex align-items-center">
              <div className="dropdown">
                <button
                  className="btn btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{ width: '36px', height: '36px' }}
                  >
                    {user?.name.charAt(0)}
                  </div>
                  <div className="text-start d-none d-md-block">
                    <div className="fw-semibold small">{user?.name}</div>
                    <div className="text-muted small">{user?.role}</div>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <span className="dropdown-item-text">
                      <div className="fw-semibold">{user?.name}</div>
                      <div className="text-muted small">{user?.email}</div>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <NavLink to="/employee/profile" className="dropdown-item">
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/employee/change-password" className="dropdown-item">
                      Change Password
                    </NavLink>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
