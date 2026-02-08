import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
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
            border: '1px solid rgba(0,106,72,0.2)',
          }}
        >
          <CheckCircle size={30} style={{ color: 'var(--af-tertiary)' }} />
        </div>
        <h4
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '1.375rem',
            color: 'var(--af-on-surface)',
            marginBottom: '0.5rem',
          }}
        >
          Check Your Email
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '1.5rem' }}>
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Link to="/login" className="btn btn-primary w-100 py-2">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div className="text-center mb-4">
        <h4
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '1.375rem',
            color: 'var(--af-on-surface)',
            margin: 0,
          }}
        >
          Forgot Password?
        </h4>
        <p style={{ margin: '0.375rem 0 0', fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger mb-3" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="form-label" htmlFor="fp-email">Email Address</label>
          <div className="input-group">
            <span className="input-group-text"><Mail size={16} /></span>
            <input
              id="fp-email"
              type="email"
              className="form-control"
              placeholder="you@codezenith.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2"
          disabled={loading}
        >
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center mt-3">
        <Link
          to="/login"
          className="d-inline-flex align-items-center gap-1"
          style={{
            fontSize: '0.875rem',
            color: 'var(--af-on-surface-variant)',
            textDecoration: 'none',
            fontFamily: 'var(--font-label)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={15} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
