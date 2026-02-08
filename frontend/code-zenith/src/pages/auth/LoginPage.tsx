import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 40px rgba(17,28,45,0.08), 0 1px 0 rgba(255,255,255,0.8) inset',
  padding: '2.25rem',
};

export const LoginPage: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <div className="text-center mb-4">
        <h4
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '1.375rem',
            color: 'var(--af-on-surface)',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          Welcome back
        </h4>
        <p
          style={{
            margin: '0.375rem 0 0',
            fontSize: '0.875rem',
            color: 'var(--af-on-surface-variant)',
          }}
        >
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 mb-3"
          style={{ padding: '0.75rem 1rem' }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <div className="input-group">
            <span className="input-group-text">
              <Mail size={16} />
            </span>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="you@codezenith.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label mb-0" htmlFor="login-password">Password</label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: '0.75rem',
                color: 'var(--af-primary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-label)',
                fontWeight: 600,
              }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="input-group">
            <span className="input-group-text">
              <Lock size={16} />
            </span>
            <input
              id="login-password"
              type={showPwd ? 'text' : 'password'}
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 mt-1"
          disabled={loading}
          style={{ fontSize: '0.9375rem', fontWeight: 600 }}
        >
          {loading ? (
            <span className="d-flex align-items-center justify-content-center gap-2">
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'af-spin 0.75s linear infinite',
                  display: 'inline-block',
                }}
              />
              Signing in…
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="d-flex align-items-center my-3" style={{ gap: '0.75rem' }}>
        <hr style={{ flex: 1, borderColor: 'rgba(230,235,255,0.8)', margin: 0 }} />
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-label)',
            color: 'var(--af-on-surface-variant)',
            fontWeight: 500,
          }}
        >
          OR
        </span>
        <hr style={{ flex: 1, borderColor: 'rgba(230,235,255,0.8)', margin: 0 }} />
      </div>

      {googleClientId ? (
        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setLoading(true);
                if (credentialResponse.credential) {
                  await login(undefined, undefined, credentialResponse.credential);
                  navigate(from, { replace: true });
                }
              } catch {
                setError('Google sign-in failed');
              } finally {
                setLoading(false);
              }
            }}
            onError={() => setError('Google sign-in failed')}
          />
        </div>
      ) : (
        <p
          className="text-center mb-0"
          style={{
            fontSize: '0.75rem',
            color: 'var(--af-on-surface-variant)',
            fontFamily: 'var(--font-label)',
          }}
        >
          Google sign-in unavailable (VITE_GOOGLE_CLIENT_ID not set)
        </p>
      )}

      {/* Demo credentials */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem',
          background: 'rgba(70,72,212,0.04)',
          border: '1px solid rgba(70,72,212,0.12)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <p
          className="mb-2"
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--af-secondary)',
          }}
        >
          Demo Credentials
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.25rem 1rem',
            fontSize: '0.75rem',
            color: 'var(--af-on-surface-variant)',
            fontFamily: 'var(--font-label)',
          }}
        >
          <span><strong style={{ color: 'var(--af-on-surface)' }}>Admin:</strong> admin@codezenith.com</span>
          <span><strong style={{ color: 'var(--af-on-surface)' }}>Pass:</strong> Admin@123</span>
          <span><strong style={{ color: 'var(--af-on-surface)' }}>HR:</strong> hr@codezenith.com</span>
          <span><strong style={{ color: 'var(--af-on-surface)' }}>Pass:</strong> Hr@123</span>
          <span><strong style={{ color: 'var(--af-on-surface)' }}>Manager:</strong> manager@codezenith.com</span>
          <span><strong style={{ color: 'var(--af-on-surface)' }}>Pass:</strong> Manager@123</span>
        </div>
      </div>

      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
