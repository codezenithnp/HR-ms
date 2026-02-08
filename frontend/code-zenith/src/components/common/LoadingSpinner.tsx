import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullPage = false,
}) => {
  const spinnerSize = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;
  const borderWidth = size === 'sm' ? 2 : 3;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: fullPage ? '100vh' : '240px',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: '50%',
          border: `${borderWidth}px solid rgba(189,0,26,0.15)`,
          borderTopColor: 'var(--af-primary)',
          animation: 'af-spin 0.75s linear infinite',
          flexShrink: 0,
        }}
      />
      {text && (
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: 'var(--af-on-surface-variant)',
            fontFamily: 'var(--font-label)',
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          {text}
        </p>
      )}
      <style>{`
        @keyframes af-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return content;
};
