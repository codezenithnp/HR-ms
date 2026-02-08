import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div
      className="aura-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: 'fixed',
          top: '-10%',
          right: '-5%',
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(189,0,26,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-8%',
          left: '-5%',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(70,72,212,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Logo Header */}
      <div
        className="text-center mb-4"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: 'var(--af-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: '0 8px 24px rgba(189,0,26,0.28)',
          }}
        >
          <Building2 size={28} color="white" />
        </div>
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--af-on-surface)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.01em',
          }}
        >
          CodeZenith HR
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-label)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--af-on-surface-variant)',
            marginTop: 2,
          }}
        >
          Human Resource Management
        </div>
      </div>

      {/* Auth Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
        }}
      >
        <Outlet />
      </div>

      {/* Footer */}
      <div
        className="text-center mt-4"
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '0.75rem',
          color: 'var(--af-on-surface-variant)',
          fontFamily: 'var(--font-label)',
        }}
      >
        © {new Date().getFullYear()} CodeZenith. All rights reserved.
      </div>
    </div>
  );
};
