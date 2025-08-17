import React, { useEffect, useState } from 'react';
import './headerbar.css'; // make sure to define required styles here
import { useNavigate } from 'react-router-dom';

// Headerbar component for top navigation and user info
function Headerbar() {
    const [clock, setClock] = useState('');
    const [greeting, setGreeting] = useState('');
    const [user, setUser] = useState({});
    const [profilePhoto, setProfilePhoto] = useState("");

    // Set time and greeting, updates every second
    useEffect(() => {
        const updateClockAndGreeting = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            setClock(`${hours}:${minutes}:${seconds}`);

            if (hours < 12) setGreeting('Good Morning');
            else if (hours < 18) setGreeting('Good Afternoon');
            else setGreeting('Good Evening');
        };

        const intervalId = setInterval(updateClockAndGreeting, 1000);
        updateClockAndGreeting(); // set initial time
        return () => clearInterval(intervalId);
    }, []);

    // Fetch user info and profile photo from localStorage
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('loggedInUser'));
        if (data && data.userobject) {
            setUser(data.userobject);
            setProfilePhoto(data.profile_photo || "");
        }
    }, []);

    const navigate = useNavigate();

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("isloggedInUser");
        navigate("/login"); // react-router way
    };

    return (
        <div className="search-bar">
            {/* Search input */}
            <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="search" id="mySearch" placeholder="Search..." />
            </div>

            <div className="profile-icons">
                <div className="icons">
                    {/* Email dropdown */}
                    <div className="dropdown-wrapper">
                        <i className="fa-regular fa-envelope"></i>
                        <div className="dropdown-menu hidden">
                            <p>No new emails</p>
                            <p>Check inbox</p>
                        </div>
                    </div>

                    {/* Notification dropdown */}
                    <div className="dropdown-wrapper">
                        <i className="fa-regular fa-bell"></i>
                        <div className="dropdown-menu hidden">
                            <p>No new notifications</p>
                            <p>View all</p>
                        </div>
                    </div>
                </div>

                <div className="profile">
                    <div className="red-line"></div>

                    {/* Clock */}
                    <div className="clock">{clock}</div>

                    {/* Greeting + Username */}
                    <p>
                        👋 {greeting}, <strong>{user.username || 'User'}</strong>
                    </p>

                    {/* Profile image and dropdown */}
                    <img
                        src={
                            profilePhoto
                                ? (profilePhoto.startsWith("http")
                                    ? profilePhoto
                                    : `http://localhost:3000${profilePhoto}`)
                                : "/default-profile.png"
                        }
                        alt="profile"
                        className="header-profile-img"
                    />
                    <i className="fa-solid fa-caret-down"></i>

                    {/* Profile dropdown menu */}
                    <div className="dropdown-menu hidden">
                        <p>🙎 {user.role || 'Role'}</p>
                        <p onClick={() => navigate("/my-account")} style={{ cursor: "pointer" }}>👤 My Account</p>
                        <p onClick={handleLogout} style={{ cursor: "pointer" }}>🚪 Logout</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Headerbar;
