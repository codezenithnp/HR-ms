import React from 'react';
import { Construction } from 'lucide-react';

interface StubPageProps {
  title: string;
  description?: string;
}

export const StubPage: React.FC<StubPageProps> = ({ title, description }) => {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'rgba(234,179,8,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <Construction size={36} color="#b45309" />
      </div>
      <h5 style={{ fontWeight: 700, color: 'var(--af-on-surface)', marginBottom: '0.5rem' }}>{title}</h5>
      <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', margin: 0 }}>
        {description || 'This page is under construction and will be available soon.'}
      </p>
    </div>
  );
};
