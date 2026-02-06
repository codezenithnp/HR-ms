import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Mail, Shield, Edit3, Save, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { LoadingSpinner, Badge } from '../../components/common';

export const AdminProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await authService.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      updateUser({ name: updated.name, email: updated.email });
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '100px', height: '100px' }}
              >
                <UserIcon size={48} />
              </div>
              <h4 className="mb-1">{user?.name}</h4>
              <p className="text-muted mb-3">{user?.email}</p>
              <Badge variant="primary" className="text-uppercase">
                {user?.role}
              </Badge>
              <hr className="my-4" />
              <div className="text-start">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light p-2 rounded me-3 text-muted">
                    <Mail size={16} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Email Address</small>
                    <span className="fw-medium small">{user?.email}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-light p-2 rounded me-3 text-muted">
                    <Shield size={16} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Role</small>
                    <span className="fw-medium small text-capitalize">{user?.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent d-flex align-items-center justify-content-between py-3">
              <h5 className="mb-0">Account Details</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setIsEditing(prev => !prev);
                  setError(null);
                  setSuccess(null);
                }}
              >
                <Edit3 size={14} className="me-1" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <AlertCircle size={18} className="me-2" />
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label text-muted small">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing || saving}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing || saving}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to="/admin/change-password" className="btn btn-light">
                  <Lock size={16} className="me-2" />
                  Change Password
                </Link>
                {isEditing && (
                  <button
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <Save size={16} className="me-2" />
                    )}
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
