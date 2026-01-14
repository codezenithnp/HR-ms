import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export const AdminRegisterPage: React.FC = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="card shadow-lg border-0">
            <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-4">
                    <div
                        className="bg-dark text-white rounded d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: '64px', height: '64px' }}
                    >
                        <Shield size={32} />
                    </div>
                    <h2 className="fw-bold mb-1">Admin Portal</h2>
                    <p className="text-muted">Register as Administrator</p>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <AlertCircle size={20} className="me-2" />
                        <div>{error}</div>
                    </div>
                )}

                {loading && (
                    <div className="text-center mb-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted small mt-2">Verifying Admin Access...</p>
                    </div>
                )}

                <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
                    <p className="text-center mb-3 small">Use your Google Account to register as an Admin:</p>
                    <div className="d-flex justify-content-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    setLoading(true);
                                    if (credentialResponse.credential) {
                                        // Pass googleToken and isAdminRequest=true
                                        await login(undefined, undefined, credentialResponse.credential, true);
                                        navigate('/admin/dashboard', { replace: true });
                                    }
                                } catch (err: any) {
                                    setError('Admin Registration Failed');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            onError={() => {
                                setError('Google Login Failed');
                            }}
                        />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <a href="/login" className="text-decoration-none small">Back to Regular Login</a>
                </div>
            </div>
        </div>
    );
};
