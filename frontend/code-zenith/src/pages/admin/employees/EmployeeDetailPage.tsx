import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Briefcase, Shield, Clock } from 'lucide-react';
import { LoadingSpinner, Badge } from '../../../components/common';
import { employeeService, Employee } from '../../../services/employeeService';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(id!);
      setEmployee(data);
    } catch (error) {
      console.error('Failed to load employee:', error);
      alert('Failed to load employee details');
      navigate('/admin/employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <LoadingSpinner text="Fetching employee details..." />
    </div>
  );

  if (!employee) return (
    <div className="container mt-5 text-center">
      <div className="alert alert-danger">Employee not found</div>
      <button className="btn btn-primary" onClick={() => navigate('/admin/employees')}>
        Back to List
      </button>
    </div>
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'on-leave': return 'warning';
      case 'terminated': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link p-0 me-3 text-dark" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="h3 mb-1">Employee Details</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item"><Link to="/admin/employees">Employees</Link></li>
              <li className="breadcrumb-item active">{employee.fullName || employee.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Fixed Profile Info */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4 text-center">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
              >
                {(employee.fullName || employee.name || 'E').charAt(0)}
              </div>
              <h4 className="mb-1">{employee.fullName || employee.name}</h4>
              <p className="text-muted mb-3">{employee.position}</p>
              <div className="d-flex justify-content-center gap-2 mb-4">
                <Badge variant={getStatusVariant(employee.status)}>
                  {employee.status}
                </Badge>
                <Badge variant="primary">{employee.role}</Badge>
              </div>
              <Link to={`/admin/employees/${id}/edit`} className="btn btn-outline-primary w-100">
                <Edit size={18} className="me-2" />
                Edit Profile
              </Link>
            </div>
            <div className="card-footer bg-transparent border-top p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light p-2 rounded me-3 text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="small text-muted">Email</div>
                  <div className="fw-medium">{employee.email}</div>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light p-2 rounded me-3 text-primary">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="small text-muted">Phone</div>
                  <div className="fw-medium">{employee.phone}</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-light p-2 rounded me-3 text-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="small text-muted">Address</div>
                  <div className="fw-medium small text-wrap" style={{ maxWidth: '200px' }}>
                    {employee.address || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent p-0 border-bottom">
              <ul className="nav nav-pills px-4 py-3 gap-2">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Personal Info
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'employment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('employment')}
                  >
                    Employment
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attendance')}
                  >
                    Attendance
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body p-4">
              {activeTab === 'profile' && (
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Full Name</label>
                      <div className="fs-5">{employee.fullName || employee.name}</div>
                    </div>
                    <div className="mb-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Employee ID</label>
                      <div className="fs-5">{employee.employeeId}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Date of Birth</label>
                      <div className="fs-5">
                        {employee.dateOfBirth || employee.dob ?
                          new Date(employee.dateOfBirth || employee.dob!).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'employment' && (
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Department</label>
                      <div className="d-flex align-items-center">
                        <Briefcase size={20} className="text-primary me-2" />
                        <span className="fs-5">{employee.department}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Position</label>
                      <div className="fs-5">{employee.position}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Join Date</label>
                      <div className="d-flex align-items-center">
                        <Calendar size={20} className="text-primary me-2" />
                        <span className="fs-5">
                          {new Date(employee.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-muted small fw-bold text-uppercase mb-1 d-block">User Role</label>
                      <div className="d-flex align-items-center">
                        <Shield size={20} className="text-primary me-2" />
                        <span className="fs-5">{employee.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="text-center py-5">
                  <Clock size={48} className="text-muted mb-3 opacity-25" />
                  <h5>Attendance History</h5>
                  <p className="text-muted mb-4">View detailed attendance logs for this employee.</p>
                  <Link to={`/admin/attendance/${employee.id}`} className="btn btn-primary">
                    View Logs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
