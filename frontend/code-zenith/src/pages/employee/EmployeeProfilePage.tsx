import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Edit,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services';
import { Employee } from '../../services/employeeService';
import { LoadingSpinner, Badge } from '../../components/common';

export const EmployeeProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'account'>('personal');

  useEffect(() => {
    if (user) {
      loadEmployeeDetails();
    }
  }, [user]);

  const loadEmployeeDetails = async () => {
    try {
      const data = await employeeService.getEmployeeById(user?.id || '');
      setEmployee(data);
    } catch (error) {
      console.error('Failed to load employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!employee) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Failed to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-4">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '100px', height: '100px' }}
              >
                <UserIcon size={48} />
              </div>
              <h4 className="mb-1">{employee.fullName || employee.name}</h4>
              <p className="text-muted mb-3">{employee.position}</p>
              <Badge variant={employee.status === 'active' ? 'success' : 'warning'}>
                {employee.status.toUpperCase()}
              </Badge>
              <hr className="my-4" />
              <div className="text-start">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light p-2 rounded me-3 text-muted">
                    <Mail size={16} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Email Address</small>
                    <span className="fw-medium small">{employee.email}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-0">
                  <div className="bg-light p-2 rounded me-3 text-muted">
                    <Phone size={16} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Phone Number</small>
                    <span className="fw-medium small">{employee.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent p-0">
              <ul className="nav nav-tabs nav-fill border-0">
                <li className="nav-item">
                  <button
                    className={`nav-link py-3 border-0 ${activeTab === 'personal' ? 'active fw-bold text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link py-3 border-0 ${activeTab === 'job' ? 'active fw-bold text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                    onClick={() => setActiveTab('job')}
                  >
                    Job Information
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body p-4 p-md-5">
              {activeTab === 'personal' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Personal Information</h5>
                    <button className="btn btn-sm btn-outline-primary" disabled>
                      <Edit size={14} className="me-1" /> Edit Profile
                    </button>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6 text-sm">
                      <label className="text-muted d-block mb-1">Full Name</label>
                      <p className="fw-medium mb-0">{employee.fullName || employee.name}</p>
                    </div>
                    <div className="col-md-6 text-sm">
                      <label className="text-muted d-block mb-1">Date of Birth</label>
                      <p className="fw-medium mb-0">
                        <Calendar size={14} className="me-2 text-muted" />
                        {employee.dateOfBirth || employee.dob || 'Not provided'}
                      </p>
                    </div>
                    <div className="col-12 text-sm">
                      <label className="text-muted d-block mb-1">Residential Address</label>
                      <p className="fw-medium mb-0">
                        <MapPin size={14} className="me-2 text-muted" />
                        {employee.address}
                      </p>
                    </div>
                  </div>

                  <div className="alert alert-secondary mt-5 small d-flex align-items-start border-0 bg-light">
                    <Info size={16} className="me-2 mt-1 text-primary" />
                    <div>
                      Some fields are managed by HR. If you need to update them, please contact your HR representative.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'job' && (
                <div>
                  <h5 className="mb-4">Professional Information</h5>
                  <div className="row g-4 text-sm">
                    <div className="col-md-6">
                      <label className="text-muted d-block mb-1">Employee ID</label>
                      <p className="fw-medium mb-0">
                        <Shield size={14} className="me-2 text-muted" />
                        {employee.employeeId}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted d-block mb-1">Department</label>
                      <p className="fw-medium mb-0">
                        <Briefcase size={14} className="me-2 text-muted" />
                        {employee.department}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted d-block mb-1">Current Position</label>
                      <p className="fw-medium mb-0">{employee.position}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted d-block mb-1">Joining Date</label>
                      <p className="fw-medium mb-0">
                        <Calendar size={14} className="me-2 text-muted" />
                        {new Date(employee.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted d-block mb-1">Employment Type</label>
                      <p className="fw-medium mb-0">Full Time</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted d-block mb-1">Reporting Role</label>
                      <p className="fw-medium mb-0 text-capitalize">{employee.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
