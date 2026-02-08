import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  pill?: boolean;
  className?: string;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary:   { background: 'rgba(189,0,26,0.10)',    color: 'var(--af-primary)',   border: '1px solid rgba(189,0,26,0.18)' },
  danger:    { background: 'rgba(189,0,26,0.10)',    color: 'var(--af-primary)',   border: '1px solid rgba(189,0,26,0.18)' },
  secondary: { background: 'rgba(93,63,60,0.08)',    color: 'var(--af-on-surface-variant)', border: '1px solid rgba(93,63,60,0.15)' },
  success:   { background: 'rgba(0,106,72,0.10)',    color: '#004d35',             border: '1px solid rgba(0,106,72,0.2)' },
  warning:   { background: 'rgba(180,130,0,0.10)',   color: '#7a5500',             border: '1px solid rgba(180,130,0,0.2)' },
  info:      { background: 'rgba(70,72,212,0.10)',   color: 'var(--af-secondary)', border: '1px solid rgba(70,72,212,0.18)' },
  light:     { background: 'rgba(255,255,255,0.7)',  color: 'var(--af-on-surface)', border: '1px solid var(--glass-border)' },
  dark:      { background: 'var(--af-inverse-surface)', color: 'var(--af-inverse-on-surface)', border: 'none' },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  pill = true,
  className = '',
}) => {
  const style = variantStyles[variant] || variantStyles.secondary;
  const borderRadius = pill ? '9999px' : '6px';

  return (
    <span
      className={className}
      style={{
        ...style,
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius,
        padding: '0.2rem 0.6rem',
        fontSize: '0.6875rem',
        fontFamily: 'var(--font-label)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};
