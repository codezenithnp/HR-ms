import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="fw-bold mb-1">CodeZenith HR</h2>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <AlertCircle size={20} className="me-2" />
              <div>{error}</div>
            </div>
          )}

          <div className="mb-3">
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

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
              />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="/forgot-password" className="text-decoration-none small">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-3">
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>
          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setLoading(true);
                  if (credentialResponse.credential) {
                    await login(undefined, undefined, credentialResponse.credential); // Adjusted to pass token
                    navigate(from, { replace: true });
                  }
                } catch (err: any) {
                  setError('Google Login Failed');
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => {
                setError('Google Login Failed');
              }}
            />
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-3 bg-light rounded">
          <p className="small fw-semibold mb-2 text-muted">Demo Credentials:</p>
          <div className="small">
            <p className="mb-1"><strong>Admin:</strong> admin@codezenith.com</p>
            <p className="mb-1"><strong>HR:</strong> hr@codezenith.com</p>
            <p className="mb-1"><strong>Manager:</strong> manager@codezenith.com</p>
            <p className="mb-1"><strong>Employee:</strong> john.doe@codezenith.com</p>
            <p className="mb-0"><strong>Password:</strong> password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
