import React, { useState } from 'react';
import './forgot_password.css';
import { axiosInstance } from '../lib/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
    // Get user id and token from URL params
    const { id, token } = useParams();
    // State for new password input and loading indicator
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form submission for resetting password
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate new password input
        if (!newPassword.trim()) {
            toast.error("Please enter your new password.");
            return;
        }
        setLoading(true);
        try {
            // Send reset password request to backend
            const res = await axiosInstance.post(`/reset-password/${id}/${token}`, { newPassword });
            toast.success(res.data?.message || "Password successfully reset.");
            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            // Show error message if request fails
            toast.error(
                err.response?.data?.message ||
                "Failed to reset password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Left panel with logo and welcome message */}
            <div className="left-panel">
                <div className="overlay">
                    <img className="logo" src={logo} alt="school logo" />
                    <h1>WELCOME</h1>
                </div>
            </div>
            {/* Right panel with reset password form */}
            <div className="right-panel">
                <form className="form-box" onSubmit={handleSubmit}>
                    <label>New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />
                    {/* Submit button */}
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    {/* Link to login page */}
                    <button type="button">
                        <Link to="/login">Login</Link>
                    </button>
                </form>
                {/* Footer */}
                <p>© 2024 Firm Foundation School Management</p>
            </div>
            {/* Toast notifications */}
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
}

export default ResetPassword;