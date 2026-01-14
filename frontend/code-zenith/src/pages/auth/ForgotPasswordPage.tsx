import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      <div className="card shadow-lg border-0">
        <div className="card-body p-5 text-center">
          <div
            className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '64px', height: '64px' }}
          >
            <CheckCircle size={32} />
          </div>
          <h2 className="fw-bold mb-3">Check Your Email</h2>
          <p className="text-muted mb-4">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Link to="/login" className="btn btn-primary">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-5">
        {/* Logo */}
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '64px', height: '64px' }}
          >
            <Building2 size={32} />
          </div>
          <h2 className="fw-bold mb-1">Forgot Password?</h2>
          <p className="text-muted">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Mail size={18} />
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="you@codezenith.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <Link
            to="/login"
            className="btn btn-link w-100 text-decoration-none d-flex align-items-center justify-content-center"
          >
            <ArrowLeft size={16} className="me-2" />
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};
