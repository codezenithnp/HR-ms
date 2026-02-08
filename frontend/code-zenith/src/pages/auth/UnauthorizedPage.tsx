import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div
      className="aura-bg d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', textAlign: 'center', padding: '2rem' }}
    >
      <div>
        <div
          style={{
            width: 96,
            height: 96,
            background: 'rgba(189,0,26,0.1)',
            border: '1px solid rgba(189,0,26,0.2)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <ShieldAlert size={44} style={{ color: 'var(--af-primary)' }} />
        </div>

        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--af-on-surface)',
            marginBottom: '0.5rem',
          }}
        >
          403
        </h1>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--af-on-surface)',
            marginBottom: '0.75rem',
          }}
        >
          Access Denied
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--af-on-surface-variant)',
            marginBottom: '2rem',
            maxWidth: 360,
            margin: '0 auto 2rem',
          }}
        >
          You don't have permission to access this page. Please contact your administrator.
        </p>

        <Link
          to="/"
          className="btn btn-primary d-inline-flex align-items-center gap-2 py-2 px-4"
        >
          <ArrowLeft size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
