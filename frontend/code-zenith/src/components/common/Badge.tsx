import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  pill?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  pill = false,
  className = '',
}) => {
  return (
    <span className={`badge bg-${variant} ${pill ? 'rounded-pill' : ''} ${className}`}>
      {children}
    </span>
  );
};
