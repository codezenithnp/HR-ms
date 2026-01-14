import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div
          className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
          style={{ width: '100px', height: '100px' }}
        >
          <ShieldAlert size={48} />
        </div>
        <h1 className="display-4 fw-bold mb-3">Access Denied</h1>
        <p className="lead text-muted mb-4">
          You don't have permission to access this page.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
