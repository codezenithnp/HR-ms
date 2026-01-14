import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  iconBgColor?: string;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'primary',
  iconBgColor,
  iconColor,
  subtitle,
  trend,
}) => {
  const variantClasses: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary bg-opacity-10', text: 'text-primary' },
    success: { bg: 'bg-success bg-opacity-10', text: 'text-success' },
    warning: { bg: 'bg-warning bg-opacity-10', text: 'text-warning' },
    danger: { bg: 'bg-danger bg-opacity-10', text: 'text-danger' },
    info: { bg: 'bg-info bg-opacity-10', text: 'text-info' },
    secondary: { bg: 'bg-secondary bg-opacity-10', text: 'text-secondary' },
  };

  const bgClass = iconBgColor || variantClasses[variant].bg;
  const textClass = iconColor || variantClasses[variant].text;

  return (
    <div className="card stat-card h-100 border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <p className="text-muted mb-2 small fw-bold text-uppercase">{title}</p>
            <h3 className="mb-0 fw-bold">{value}</h3>
            {subtitle && <p className="text-muted mb-0 small mt-1">{subtitle}</p>}
            {trend && (
              <p className={`mb-0 small mt-1 ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div className={`stat-icon ${bgClass} ${textClass} p-3 rounded-circle d-flex align-items-center justify-content-center`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
