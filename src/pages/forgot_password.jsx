import React, { useState } from 'react';
import './forgot_password.css';
import { axiosInstance } from '../lib/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

// Forgot_password component for handling password reset requests
function Forgot_password() {
    // State for email input and loading indicator
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form submission for password reset
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate email input
        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }
        setLoading(true);
        try {
            // Send password reset request to backend
            const res = await axiosInstance.post('/forgot-password', { email });
            toast.success(res.data?.message || "Password reset link sent to your email.");
            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 1500); // Redirect after 1.5 seconds
        } catch (err) {
            // Show error message if request fails
            toast.error(
                err.response?.data?.message ||
                "Failed to send reset link. Please try again."
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

            {/* Right panel with reset form */}
            <div className="right-panel">
                <form className="form-box" onSubmit={handleSubmit}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />
                    {/* Submit button */}
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Reset Password"}
                    </button>
                    {/* Link to login page */}
                    <button>
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

export default Forgot_password;