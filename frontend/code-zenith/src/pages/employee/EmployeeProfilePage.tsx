import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Briefcase, Shield, Edit, Info } from 'lucide-react';
import { employeeService } from '../../services';
import { Employee } from '../../services/employeeService';
import { LoadingSpinner, Badge } from '../../components/common';

export const EmployeeProfilePage: React.FC = () => {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'account'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);
  const [formData, setFormData] = useState({ phone: '', address: '' });

  useEffect(() => { loadEmployeeDetails(); }, []);

  const loadEmployeeDetails = async () => {
    try {
      const data = await employeeService.getMyProfile();
      setEmployee(data);
      setFormData({ phone: data.phone || '', address: data.address || '' });
    } catch (error) {
      console.error('Failed to load employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!employee) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await employeeService.updateMyProfile({ phone: formData.phone, address: formData.address });
      setEmployee(updated);
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile…" />;
  if (!employee) return <div className="empty-state"><p style={{ color: 'var(--af-error)' }}>Failed to load profile data.</p></div>;

  const name    = employee.fullName || employee.name || 'Employee';
  const initial = name.charAt(0).toUpperCase();

  const tabs: Array<{ key: 'personal' | 'job' | 'account'; label: string }> = [
    { key: 'personal', label: 'Personal Details' },
    { key: 'job',      label: 'Job Information' },
    { key: 'account',  label: 'Account' },
  ];

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) => (
    <div>
      <div className="label-sm mb-1">{label}</div>
      <div className="d-flex align-items-center gap-2" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
        <Icon size={14} color="var(--af-on-surface-variant)" />
        {value}
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Your personal and professional information</p>
      </div>

      <div className="row g-4">
        {/* Left — identity card */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body text-center" style={{ padding: '2rem 1.5rem' }}>
              <div className="avatar avatar-2xl avatar-red mx-auto mb-3" style={{ fontSize: '2rem' }}>{initial}</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{name}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '0.75rem' }}>{employee.position}</p>
              <Badge variant={employee.status === 'active' ? 'success' : 'warning'}>{employee.status}</Badge>
              <hr style={{ margin: '1.5rem 0', borderColor: 'var(--af-surface-container)' }} />
              <div className="text-start d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--af-surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={15} color="var(--af-on-surface-variant)" />
                  </div>
                  <div>
                    <div className="label-sm mb-0">Email</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{employee.email}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--af-surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={15} color="var(--af-on-surface-variant)" />
                  </div>
                  <div>
                    <div className="label-sm mb-0">Phone</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{employee.phone || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — tabbed details */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header" style={{ padding: 0 }}>
              <ul className="nav nav-tabs" style={{ padding: '0 1.25rem', gap: '0.25rem' }}>
                {tabs.map(({ key, label }) => (
                  <li key={key} className="nav-item">
                    <button
                      className={`nav-link${activeTab === key ? ' active' : ''}`}
                      style={{ fontWeight: activeTab === key ? 700 : 500, fontSize: '0.875rem', padding: '0.875rem 1rem' }}
                      onClick={() => setActiveTab(key)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-body" style={{ padding: '1.5rem' }}>
              {activeTab === 'personal' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 style={{ fontWeight: 700, margin: 0 }}>Personal Information</h5>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(70,72,212,0.08)', color: 'var(--af-secondary)', border: 'none', fontSize: '0.8125rem' }}
                      onClick={() => { setIsEditing((p) => !p); setError(null); setSuccess(null); }}
                    >
                      <Edit size={13} style={{ marginRight: 4 }} />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {error   && <div className="alert alert-danger mb-3" style={{ fontSize: '0.875rem' }}>{error}</div>}
                  {success && <div className="alert alert-success mb-3" style={{ fontSize: '0.875rem' }}>{success}</div>}

                  <div className="row g-4">
                    <div className="col-md-6">
                      <InfoRow icon={Shield} label="Full Name" value={name} />
                    </div>
                    <div className="col-md-6">
                      <InfoRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth || (employee as any).dob || 'Not provided'} />
                    </div>
                    <div className="col-md-6">
                      <div className="label-sm mb-1">Phone Number</div>
                      {isEditing ? (
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} disabled={saving} />
                      ) : (
                        <div className="d-flex align-items-center gap-2" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          <Phone size={14} color="var(--af-on-surface-variant)" />
                          {employee.phone || 'Not provided'}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="label-sm mb-1">Residential Address</div>
                      {isEditing ? (
                        <textarea name="address" className="form-control" rows={3} value={formData.address} onChange={handleChange} disabled={saving} />
                      ) : (
                        <div className="d-flex align-items-center gap-2" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          <MapPin size={14} color="var(--af-on-surface-variant)" />
                          {employee.address || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="d-flex justify-content-end mt-4">
                      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
                        {saving && <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} />}
                        Save Changes
                      </button>
                    </div>
                  )}

                  <div className="d-flex align-items-start gap-2 mt-4" style={{ background: 'rgba(70,72,212,0.06)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>
                    <Info size={15} style={{ flexShrink: 0, color: 'var(--af-secondary)', marginTop: 1 }} />
                    Some fields are managed by HR. Contact your HR representative to update them.
                  </div>
                </div>
              )}

              {activeTab === 'job' && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Professional Information</h5>
                  <div className="row g-4">
                    <div className="col-md-6"><InfoRow icon={Shield} label="Employee ID" value={employee.employeeId} /></div>
                    <div className="col-md-6"><InfoRow icon={Briefcase} label="Department" value={employee.department} /></div>
                    <div className="col-md-6"><InfoRow icon={Briefcase} label="Position" value={employee.position} /></div>
                    <div className="col-md-6">
                      <InfoRow icon={Calendar} label="Joining Date" value={new Date(employee.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
                    </div>
                    <div className="col-md-6"><InfoRow icon={Shield} label="Employment Type" value="Full Time" /></div>
                    <div className="col-md-6">
                      <InfoRow icon={Shield} label="Role" value={<span style={{ textTransform: 'capitalize' }}>{employee.role}</span>} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Account Overview</h5>
                  <div className="row g-4">
                    <div className="col-md-6"><InfoRow icon={Mail} label="Account Email" value={employee.email} /></div>
                    <div className="col-md-6">
                      <InfoRow icon={Shield} label="Role" value={<span style={{ textTransform: 'capitalize' }}>{employee.role}</span>} />
                    </div>
                    <div className="col-md-6">
                      <div className="label-sm mb-1">Status</div>
                      <Badge variant={employee.status === 'active' ? 'success' : 'warning'}>{employee.status}</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
