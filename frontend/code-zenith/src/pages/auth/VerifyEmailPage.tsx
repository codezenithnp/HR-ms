import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../../services';
import { LoadingSpinner } from '../../components/common';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 40px rgba(17,28,45,0.08), 0 1px 0 rgba(255,255,255,0.8) inset',
  padding: '2.25rem',
  textAlign: 'center',
};

export const VerifyEmailPage: React.FC = () => {
  const { token }  = useParams<{ token: string }>();
  const [status, setStatus]   = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      authService.verifyEmail(token)
        .then(() => setStatus('success'))
        .catch((err: any) => {
          setStatus('error');
          setMessage(err.message || 'Verification failed');
        });
    } else {
      setStatus('error');
      setMessage('Invalid verification token.');
    }
  }, [token]);

  return (
    <div style={cardStyle}>
      {status === 'verifying' && (
        <>
          <LoadingSpinner size="md" />
          <h4 style={{ fontWeight: 700, marginTop: '0.5rem', marginBottom: '0.5rem' }}>Verifying Email…</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', margin: 0 }}>
            Please wait while we verify your email address.
          </p>
        </>
      )}

      {status === 'success' && (
        <>
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
          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Email Verified!</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '1.5rem' }}>
            Your email has been verified. You can now sign in to your account.
          </p>
          <Link to="/login" className="btn btn-primary w-100 py-2">Proceed to Sign In</Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'rgba(189,0,26,0.1)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <XCircle size={30} style={{ color: 'var(--af-primary)' }} />
          </div>
          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Verification Failed</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '1.5rem' }}>
            {message || 'The verification link is invalid or has expired.'}
          </p>
          <Link to="/login" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </>
      )}
    </div>
  );
};
