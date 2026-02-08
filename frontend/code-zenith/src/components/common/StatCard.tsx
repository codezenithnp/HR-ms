import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'red' | 'blue' | 'green' | 'amber' | 'purple';
  iconBgColor?: string;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const variantMap: Record<string, { bg: string; color: string; accent: string }> = {
  red:    { bg: 'rgba(189,0,26,0.08)',    color: 'var(--af-primary)',   accent: 'var(--af-primary)' },
  blue:   { bg: 'rgba(70,72,212,0.10)',   color: 'var(--af-secondary)', accent: 'var(--af-secondary)' },
  green:  { bg: 'rgba(0,106,72,0.10)',    color: 'var(--af-tertiary)',  accent: 'var(--af-tertiary)' },
  amber:  { bg: 'rgba(180,130,0,0.10)',   color: '#8a6000',             accent: '#b48200' },
  purple: { bg: 'rgba(100,0,200,0.08)',   color: '#5a00b0',             accent: '#7800d8' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'blue',
  subtitle,
  trend,
}) => {
  const v = variantMap[variant] || variantMap.blue;

  return (
    <div
      className="card stat-card h-100"
      style={{ '--stat-accent': v.accent } as React.CSSProperties}
    >
      <div className="card-body" style={{ padding: '1.25rem' }}>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1 me-3">
            <p
              className="label-sm mb-2"
              style={{ color: 'var(--af-on-surface-variant)' }}
            >
              {title}
            </p>
            <h3
              style={{
                fontSize: '1.875rem',
                fontWeight: 700,
                color: 'var(--af-on-surface)',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {value}
            </h3>
            {subtitle && (
              <p
                style={{
                  marginTop: '0.375rem',
                  marginBottom: 0,
                  fontSize: '0.75rem',
                  color: 'var(--af-on-surface-variant)',
                  fontFamily: 'var(--font-label)',
                }}
              >
                {subtitle}
              </p>
            )}
            {trend && (
              <p
                style={{
                  marginTop: '0.375rem',
                  marginBottom: 0,
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-label)',
                  fontWeight: 600,
                  color: trend.isPositive ? 'var(--af-tertiary)' : 'var(--af-primary)',
                }}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div
            className="stat-icon"
            style={{ background: v.bg, color: v.color }}
          >
            <Icon size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};
