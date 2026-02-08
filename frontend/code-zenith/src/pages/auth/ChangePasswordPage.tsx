import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../services';

export const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword]     = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirm]     = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState(false);
  const navigate                          = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return; }
    if (newPassword.length < 8)          { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setSuccess(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Change Password</h1>
        <p className="page-subtitle">Update your account password</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card">
            <div className="card-body">
              {success && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                  <CheckCircle size={16} />
                  <span>Password changed successfully! Redirecting…</span>
                </div>
              )}
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="cp-old">Current Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><Lock size={16} /></span>
                    <input
                      id="cp-old"
                      type="password"
                      className="form-control"
                      placeholder="Enter current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      disabled={success}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="cp-new">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><Lock size={16} /></span>
                    <input
                      id="cp-new"
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={success}
                    />
                  </div>
                  <div className="form-text">Must be at least 8 characters long</div>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="cp-confirm">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><Lock size={16} /></span>
                    <input
                      id="cp-confirm"
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      disabled={success}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || success}
                  >
                    {loading ? 'Changing…' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading || success}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
