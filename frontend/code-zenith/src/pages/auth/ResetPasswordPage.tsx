import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Building2, AlertCircle } from 'lucide-react';
import { authService } from '../../services';

export const ResetPasswordPage: React.FC = () => {
    const { resetToken } = useParams<{ resetToken: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(password, resetToken!);
            setSuccess(true);
            // Optional: Auto redirect after few seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="card shadow-lg border-0">
                <div className="card-body p-5 text-center">
                    <div
                        className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: '64px', height: '64px' }}
                    >
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="fw-bold mb-3">Password Reset!</h2>
                    <p className="text-muted mb-4">
                        Your password has been successfully updated. Redirecting to login...
                    </p>
                    <Link to="/login" className="btn btn-primary">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-lg border-0">
            <div className="card-body p-5">
                <div className="text-center mb-4">
                    <div
                        className="bg-primary text-white rounded d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: '64px', height: '64px' }}
                    >
                        <Building2 size={32} />
                    </div>
                    <h2 className="fw-bold mb-1">Reset Password</h2>
                    <p className="text-muted">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <AlertCircle size={18} className="me-2" />
                            <div>{error}</div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 mb-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Resetting...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>

                    <Link
                        to="/login"
                        className="btn btn-link w-100 text-decoration-none d-flex align-items-center justify-content-center"
                    >
                        <ArrowLeft size={16} className="me-2" />
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    );
};
