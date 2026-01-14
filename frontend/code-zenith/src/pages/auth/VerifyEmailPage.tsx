import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '../../services';

export const VerifyEmailPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('Invalid verification token.');
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            await authService.verifyEmail(token!);
            setStatus('success');
        } catch (error: any) {
            console.error('Verification failed:', error);
            setStatus('error');
            setMessage(error.message || 'Verification failed');
        }
    };

    return (
        <div className="card shadow-lg border-0">
            <div className="card-body p-5 text-center">
                {status === 'verifying' && (
                    <div>
                        <div className="text-primary mb-3">
                            <Loader2 size={48} className="animate-spin mx-auto" />
                        </div>
                        <h2 className="fw-bold mb-3">Verifying Email...</h2>
                        <p className="text-muted">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div
                            className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: '64px', height: '64px' }}
                        >
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="fw-bold mb-3">Email Verified!</h2>
                        <p className="text-muted mb-4">
                            Your email has been successfully verified. You can now log in to your account.
                        </p>
                        <Link to="/login" className="btn btn-primary px-4">
                            Proceed to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div
                            className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: '64px', height: '64px' }}
                        >
                            <XCircle size={32} />
                        </div>
                        <h2 className="fw-bold mb-3">Verification Failed</h2>
                        <p className="text-muted mb-4">
                            {message || 'The verification link is invalid or has expired.'}
                        </p>
                        <Link to="/login" className="btn btn-outline-primary d-inline-flex align-items-center">
                            <ArrowLeft size={16} className="me-2" />
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
