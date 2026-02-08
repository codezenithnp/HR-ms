import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
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

export const AdminRegisterPage: React.FC = () => {
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  return (
    <div style={cardStyle}>
      <div className="text-center mb-4">
        <div
          style={{
            width: 56,
            height: 56,
            background: 'var(--af-inverse-surface)',
            borderRadius: 'var(--radius-lg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 16px rgba(17,28,45,0.2)',
          }}
        >
          <Shield size={26} color="white" />
        </div>
        <h4
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '1.375rem',
            color: 'var(--af-on-surface)',
            margin: 0,
          }}
        >
          Admin Portal
        </h4>
        <p style={{ margin: '0.375rem 0 0', fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
          Register as Administrator using Google
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-center mb-3">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '3px solid rgba(17,28,45,0.12)',
              borderTopColor: 'var(--af-on-surface)',
              animation: 'af-spin 0.75s linear infinite',
              display: 'inline-block',
            }}
          />
          <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', marginTop: '0.5rem', marginBottom: 0 }}>
            Verifying admin access…
          </p>
        </div>
      )}

      <div style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
        {googleClientId ? (
          <>
            <p
              className="text-center mb-3"
              style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}
            >
              Use your Google Account to register as Admin:
            </p>
            <div className="d-flex justify-content-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setLoading(true);
                    if (credentialResponse.credential) {
                      await login(undefined, undefined, credentialResponse.credential, true);
                      navigate('/admin/dashboard', { replace: true });
                    }
                  } catch {
                    setError('Admin registration failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                onError={() => setError('Google sign-in failed')}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              padding: '1rem',
              background: 'rgba(93,63,60,0.05)',
              border: '1px solid rgba(93,63,60,0.12)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--af-on-surface-variant)',
            }}
          >
            Admin registration via Google is disabled.<br />
            Configure <code>VITE_GOOGLE_CLIENT_ID</code> to enable.
          </div>
        )}
      </div>

      <div className="text-center mt-4">
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

      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
