import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Briefcase, Shield, Clock } from 'lucide-react';
import { LoadingSpinner, Badge } from '../../../components/common';
import { employeeService, Employee } from '../../../services/employeeService';

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="d-flex align-items-start gap-3 mb-3">
    <div
      style={{
        width: 36,
        height: 36,
        background: 'rgba(70,72,212,0.08)',
        color: 'var(--af-secondary)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div className="label-sm mb-0" style={{ color: 'var(--af-on-surface-variant)', marginBottom: '0.125rem' }}>{label}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--af-on-surface)' }}>{value || '—'}</div>
    </div>
  </div>
);

export const EmployeeDetailPage: React.FC = () => {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => { if (id) loadEmployee(); }, [id]);

  const loadEmployee = async () => {
    try {
      setEmployee(await employeeService.getEmployeeById(id!));
    } catch {
      alert('Failed to load employee details');
      navigate('/admin/employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading employee…" />;
  if (!employee) return (
    <div className="alert alert-danger text-center">
      Employee not found.{' '}
      <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => navigate('/admin/employees')}>Back to List</button>
    </div>
  );

  const name = employee.fullName || employee.name || 'Employee';
  const statusVariant = (s: string) => ({ active: 'success', inactive: 'secondary', 'on-leave': 'warning', terminated: 'danger' } as any)[s] || 'secondary';

  const tabs = ['profile', 'employment', 'attendance'];

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center mb-4 gap-3">
        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(17,28,45,0.06)', border: 'none', color: 'var(--af-on-surface-variant)', borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="page-header mb-0">
          <h1 className="page-title">Employee Details</h1>
          <p className="page-subtitle">
            <Link to="/admin/employees" style={{ color: 'var(--af-secondary)', textDecoration: 'none' }}>Employees</Link>
            {' / '}{name}
          </p>
        </div>
        <div className="ms-auto">
          <Link to={`/admin/employees/${id}/edit`} className="btn btn-primary d-flex align-items-center gap-2">
            <Edit size={16} /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card text-center mb-3">
            <div className="card-body" style={{ padding: '2rem 1.5rem' }}>
              <div
                className="avatar avatar-2xl avatar-red mx-auto mb-3"
                style={{ fontSize: '2.5rem' }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
              <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{name}</h5>
              <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '0.875rem' }}>
                {employee.position} · {employee.department}
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Badge variant={statusVariant(employee.status)}>{employee.status}</Badge>
                <Badge variant="info">{employee.role}</Badge>
              </div>
            </div>
            <div className="card-footer" style={{ padding: '1rem 1.5rem' }}>
              <InfoRow icon={<Mail size={16} />} label="Email" value={employee.email} />
              <InfoRow icon={<Phone size={16} />} label="Phone" value={employee.phone} />
              <InfoRow icon={<MapPin size={16} />} label="Address" value={employee.address} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header" style={{ padding: '0 1.5rem' }}>
              <ul className="nav nav-tabs border-0" style={{ marginBottom: '-1px', gap: '0.25rem' }}>
                {tabs.map((tab) => (
                  <li key={tab} className="nav-item">
                    <button
                      className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                      style={{ textTransform: 'capitalize', padding: '0.875rem 1rem' }}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'profile' ? 'Personal Info' : tab === 'employment' ? 'Employment' : 'Attendance'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'profile' && (
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Full Name</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{name}</div>
                    </div>
                    <div className="mb-4">
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Employee ID</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'var(--font-label)' }}>{employee.employeeId}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Date of Birth</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                        {employee.dateOfBirth || (employee as any).dob
                          ? new Date((employee.dateOfBirth || (employee as any).dob)!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          : 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Phone</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{employee.phone || '—'}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'employment' && (
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Department</div>
                      <div className="d-flex align-items-center gap-2">
                        <Briefcase size={16} style={{ color: 'var(--af-secondary)' }} />
                        <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{employee.department}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Position</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{employee.position}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Join Date</div>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={16} style={{ color: 'var(--af-secondary)' }} />
                        <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                          {new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="label-sm mb-1" style={{ color: 'var(--af-on-surface-variant)' }}>Role</div>
                      <div className="d-flex align-items-center gap-2">
                        <Shield size={16} style={{ color: 'var(--af-secondary)' }} />
                        <span style={{ fontSize: '0.9375rem', fontWeight: 500, textTransform: 'capitalize' }}>{employee.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="empty-state">
                  <Clock size={48} />
                  <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>Attendance History</h6>
                  <p style={{ fontSize: '0.875rem', margin: '0 0 1rem' }}>View detailed attendance logs for this employee.</p>
                  <Link to={`/admin/attendance/${employee.id}`} className="btn btn-primary">
                    View Attendance Logs
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
