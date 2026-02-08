import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { authService } from '../../services';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 40px rgba(17,28,45,0.08), 0 1px 0 rgba(255,255,255,0.8) inset',
  padding: '2.25rem',
};

export const ResetPasswordPage: React.FC = () => {
  const { resetToken } = useParams<{ resetToken: string }>();
  const navigate = useNavigate();

  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [showPwd, setShowPwd]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6)          { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      await authService.resetPassword(password, resetToken!);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={cardStyle} className="text-center">
        <div
          style={{
            width: 64,
            height: 64,
            background: 'rgba(0,106,72,0.1)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <CheckCircle size={30} style={{ color: 'var(--af-tertiary)' }} />
        </div>
        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Password Reset!</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '1.5rem' }}>
          Your password has been updated. Redirecting to sign in…
        </p>
        <Link to="/login" className="btn btn-primary w-100 py-2">Go to Sign In</Link>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div className="text-center mb-4">
        <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.375rem', color: 'var(--af-on-surface)', margin: 0 }}>
          Reset Password
        </h4>
        <p style={{ margin: '0.375rem 0 0', fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ padding: '0.75rem 1rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <div className="input-group">
            <span className="input-group-text"><Lock size={16} /></span>
            <input
              type={showPwd ? 'text' : 'password'}
              className="form-control"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="input-group-text border-start-0"
              style={{ background: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Confirm Password</label>
          <div className="input-group">
            <span className="input-group-text"><Lock size={16} /></span>
            <input
              type={showPwd ? 'text' : 'password'}
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>

      <div className="text-center mt-3">
        <Link to="/login" className="d-inline-flex align-items-center gap-1" style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontWeight: 500 }}>
          <ArrowLeft size={15} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};
