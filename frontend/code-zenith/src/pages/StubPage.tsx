import React from 'react';
import { Construction } from 'lucide-react';

interface StubPageProps {
  title: string;
  description?: string;
}

export const StubPage: React.FC<StubPageProps> = ({ title, description }) => {
  return (
    <div className="text-center py-5">
      <div
        className="bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
        style={{ width: '100px', height: '100px' }}
      >
        <Construction size={48} />
      </div>
      <h1 className="h2 mb-3">{title}</h1>
      <p className="text-muted mb-4">
        {description || 'This page is under construction and will be implemented soon.'}
      </p>
      <p className="small text-muted">
        Follow the established patterns in the codebase to implement this page.
      </p>
    </div>
  );
};
