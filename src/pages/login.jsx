import React, { useEffect, useState } from "react";
import "./loginpage.css";
import logo from "../assets/logo.png";
import { axiosInstance } from "../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Loader from "../components/Loader"; // Import Loader

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(
        parseInt(localStorage.getItem("loginAttempts")) || 0
    );
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state

    useEffect(() => {
        // Check if user is already logged in
        const isLoggedIn = localStorage.getItem("isloggedInUser") === "true";
        // Retrieve remembered credentials if available
        const remembered = JSON.parse(localStorage.getItem("rememberMe"));

        if (isLoggedIn) {
            // Redirect to home if already logged in
            window.location.replace("/");
        } else if (remembered) {
            // Autofill username and password if "Remember Me" was checked
            setUsername(remembered.username);
            setPassword(remembered.password);
            setRememberMe(true);
        }
    }, []);

    // Validate input fields before submitting
    const isValidInput = () => {
        if (!username || !password) {
            toast.warn("All fields are required.");
            return false;
        }
        if (password.length < 8) {
            toast.warn("Password must be at least 8 characters.");
            return false;
        }
        return true;
    };

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidInput()) return;

        // Prevent login after 3 failed attempts
        if (loginAttempts >= 3) {
            toast.error("Too many failed login attempts. Try again later.");
            return;
        }
        setLoading(true); // Start loader
        try {
            // Send login request to backend
            const response = await axiosInstance.post("/login", {
                username,
                password,
            });
            // Extract user data and token from response
            const { userobject, profile, profile_photo, token } = response.data;
            // Store user info and token in localStorage
            localStorage.setItem("loggedInUser", JSON.stringify({ userobject, profile_photo }));
            localStorage.setItem("auth", JSON.stringify({ token }));
            localStorage.setItem("isloggedInUser", "true");
            // Store credentials if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem("rememberMe", JSON.stringify({ username, password }));
            } else {
                localStorage.removeItem("rememberMe");
            }
            // Reset login attempts on successful login
            localStorage.removeItem("loginAttempts");
            toast.success("Login successful!");
            setTimeout(() => {
                setLoading(false); // End loader before redirect
                window.location.href = "/";
            }, 2000);
        } catch (error) {
            // Increment login attempts on failure
            setLoginAttempts((prev) => {
                const updated = prev + 1;
                localStorage.setItem("loginAttempts", updated);
                return updated;
            });
            toast.error("Invalid credentials or server error.");
            setLoading(false); // End loader on error
        }
    };

    return (
        <div className="container">
            {loading && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(255,255,255,0.6)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Loader />
                </div>
            )}
            <div className="left-panel">
                <div className="overlay">
                    <img className="logo" src={logo} alt="school logo" />
                    <h1>WELCOME</h1>
                </div>
            </div>

            <div className="right-panel">
                <form className="form-box" onSubmit={handleSubmit}>
                    <label>Username / MobileNo</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Password</label>
                    <div className="icons-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i
                            className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ display: "block", cursor: "pointer" }}
                        ></i>
                    </div>

                    <div className="form-options">
                        <label>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember Me
                        </label>
                        <Link to="/forgot_password">Forget Password?</Link>
                    </div>

                    <button type="submit" disabled={loading}>Login</button>
                </form>
                <p>© 2024 Firm Foundation School Management</p>
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
}

export default LoginPage;
