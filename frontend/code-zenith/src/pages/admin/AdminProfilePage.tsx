import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, Edit3, Save, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { LoadingSpinner, Badge } from '../../components/common';

export const AdminProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await authService.getCurrentUser();
        setFormData({ name: data.name, email: data.email });
      } catch (err) {
        console.error('Failed to load admin profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await authService.updateProfile({ name: formData.name.trim(), email: formData.email.trim() });
      updateUser({ name: updated.name, email: updated.email });
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile…" />;

  const initial = (user?.name || 'A').charAt(0).toUpperCase();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information and preferences</p>
      </div>

      <div className="row g-4">
        {/* Left card — identity */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body text-center" style={{ padding: '2rem 1.5rem' }}>
              <div className="avatar avatar-2xl avatar-red mx-auto mb-3" style={{ fontSize: '2rem' }}>
                {initial}
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{user?.name}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '0.75rem' }}>{user?.email}</p>
              <Badge variant="primary">{user?.role}</Badge>

              <hr style={{ margin: '1.5rem 0', borderColor: 'var(--af-surface-container)' }} />

              <div className="text-start d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--af-surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={15} color="var(--af-on-surface-variant)" />
                  </div>
                  <div>
                    <div className="label-sm mb-0">Email Address</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{user?.email}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--af-surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={15} color="var(--af-on-surface-variant)" />
                  </div>
                  <div>
                    <div className="label-sm mb-0">Role</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', textTransform: 'capitalize' }}>{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right card — editable form */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Account Details</h5>
              <button
                className="btn btn-sm"
                style={{ background: 'rgba(70,72,212,0.08)', color: 'var(--af-secondary)', border: 'none', fontSize: '0.8125rem' }}
                onClick={() => { setIsEditing((p) => !p); setError(null); setSuccess(null); }}
              >
                <Edit3 size={13} style={{ marginRight: 4 }} />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <div className="card-body" style={{ padding: '1.5rem' }}>
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.875rem' }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success mb-4" style={{ fontSize: '0.875rem' }}>{success}</div>
              )}

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} disabled={!isEditing || saving} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} disabled={!isEditing || saving} />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <Link to="/admin/change-password" className="btn btn-secondary d-flex align-items-center gap-2">
                  <Lock size={15} /> Change Password
                </Link>
                {isEditing && (
                  <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} />
                    ) : <Save size={15} />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
