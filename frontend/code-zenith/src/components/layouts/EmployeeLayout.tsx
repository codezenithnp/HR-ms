import React from 'react';
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
} from 'lucide-react';

export const EmployeeLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div className="container-fluid">
          <NavLink to="/employee/dashboard" className="navbar-brand d-flex align-items-center">
            <div
              className="bg-white text-primary rounded d-flex align-items-center justify-content-center me-2"
              style={{ width: '36px', height: '36px' }}
            >
              <Building2 size={20} />
            </div>
            <span className="fw-bold">CodeZenith HR</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#employeeNav"
            aria-controls="employeeNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="employeeNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/employee/dashboard"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                >
                  <LayoutDashboard size={18} className="me-1" />
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/employee/attendance"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                >
                  <Calendar size={18} className="me-1" />
                  Attendance
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/employee/leaves"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                >
                  <FileText size={18} className="me-1" />
                  Leaves
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/employee/profile"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                >
                  <User size={18} className="me-1" />
                  Profile
                </NavLink>
              </li>
              {hasRole(['admin', 'hr', 'manager']) && (
                <li className="nav-item">
                  <NavLink
                    to="/admin/dashboard"
                    className="nav-link d-flex align-items-center"
                  >
                    <Settings size={18} className="me-1" />
                    Admin Panel
                  </NavLink>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button
                  className="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
                  >
                    {user?.name.charAt(0)}
                  </div>
                  <span className="d-none d-md-inline">{user?.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <span className="dropdown-item-text">
                      <div className="fw-semibold">{user?.name}</div>
                      <div className="text-muted small">{user?.email}</div>
                      <div className="text-muted small">{user?.employeeId}</div>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <NavLink to="/employee/profile" className="dropdown-item">
                      My Profile
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
        </div>
      </nav>

      {/* Page Content */}
      <div className="container-fluid py-4">
        <Outlet />
      </div>
    </div>
  );
};
