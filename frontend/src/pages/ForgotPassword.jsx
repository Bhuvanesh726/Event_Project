import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
    const [stage, setStage] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            alert(response.data); // "If an account with that email exists..."
            setStage('otp');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/auth/reset-password', { email, otp, newPassword });
            alert(response.data); // "Password changed successfully"
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <form onSubmit={stage === 'email' ? handleRequestOtp : handleResetPassword}>
                    {stage === 'email' ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                            <p className="text-center text-gray-600 mb-6">Enter your email to receive an OTP.</p>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full px-3 py-2 border rounded" disabled={loading} />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                            <div className="mb-4">
                                <label htmlFor="otp" className="block text-gray-700">Enter OTP from your email</label>
                                <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required
                                    className="w-full px-3 py-2 border rounded" disabled={loading} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                                <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                                    className="w-full px-3 py-2 border rounded" disabled={loading} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-gray-700">Confirm New Password</label>
                                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                    className="w-full px-3 py-2 border rounded" disabled={loading} />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Resetting...' : 'Change Password'}
                            </button>
                        </>
                    )}
                </form>
                {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
                <div className="text-center mt-4">
                    <Link to="/login" className="text-sm text-blue-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;