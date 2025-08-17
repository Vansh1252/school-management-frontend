import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

// Sidebar component for navigation, supports collapse and role-based links
function Sidebar() {
    // State for dropdowns and sidebar collapse
    const [isAccountsOpen, setIsAccountsOpen] = useState(false);
    const [isstudentOpen, setIsStudentsOpen] = useState(false);
    const [isTeacherOpen, setIsteacherOpen] = useState(false);
    const [collapsed, setIsCollapsed] = useState(false);

    // Toggle sidebar collapse
    const toggleCollapse = () => setIsCollapsed(!collapsed);

    // Dropdown handlers
    const handleonClickAccounts = () => setIsAccountsOpen(!isAccountsOpen);
    const handleonClickstudents = () => setIsStudentsOpen(!isstudentOpen);
    const handleonClickteachers = () => setIsteacherOpen(!isTeacherOpen);

    // Get user role from localStorage
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = storedUser?.userobject?.role;

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Top section with logo and collapse button */}
            <div className="topsidebar">
                <div className="logo" style={{ display: collapsed ? 'none' : 'block' }}>
                    <Link to="/"><img src={logo} alt="logo" /></Link>
                </div>
                <div className="icon">
                    <button onClick={toggleCollapse} className="nav-icon">
                        <i className={`fa-solid ${collapsed ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>

            {/* Navigation links, role-based rendering */}
            <div className="sidenav">
                {/* Dashboard link for admin */}
                {(role === 'admin') && (
                    <div className="link dashboard">
                        <Link to="/">
                            <svg width="30" height="24" fill="none"><path d="..." /></svg>
                            <span>Dashboard</span>
                        </Link>
                    </div>
                )}

                {/* Students dropdown for admin and teacher */}
                {(role === 'admin' || role === 'teacher') && (
                    <div className="link Students">
                        <div className="account-svg">
                            <button onClick={handleonClickstudents} className={`dropdown-btn ${isstudentOpen ? 'active' : ""}`}>
                                <svg width="30" height="24" fill="none"><path d="..." /></svg>
                                <span>Students</span>
                                <i className="fa fa-caret-down"></i>
                            </button>
                        </div>
                        <div className="dropdown-container" style={{ display: isstudentOpen ? 'block' : 'none' }}>
                            {/* Admin student links */}
                            {role === 'admin' && (
                                <>
                                    <div className="sub-link"><Link to="/students"><i className="fa fa-caret-right"></i>All Students</Link></div>
                                    <div className="sub-link"><Link to="/students/add"><i className="fa fa-caret-right"></i>Add Students</Link></div>
                                    <div className="sub-link"><Link to="/students/promotion"><i className="fa fa-caret-right"></i>Students Promotion</Link></div>
                                </>
                            )}
                            {/* Teacher student link */}
                            {role === 'teacher' && (
                                <div className="sub-link"><Link to="/students"><i className="fa fa-caret-right"></i>All Students</Link></div>
                            )}
                        </div>
                    </div>
                )}

                {/* Parents link for admin */}
                {role === 'admin' && (
                    <div className="link Parents">
                        <Link to="/parents">
                            <svg width="30" height="24" fill="none"><path d="..." /></svg>
                            <span>Parents</span>
                        </Link>
                    </div>
                )}

                {/* Teachers dropdown for admin */}
                {(role === 'admin') && (
                    <div className="link Teachers">
                        <div className="account-svg">
                            <button onClick={handleonClickteachers} className={`dropdown-btn ${isTeacherOpen ? 'active' : ""}`}>
                                <svg width="30" height="24" fill="none"><path d="..." /></svg>
                                <span>Teachers</span>
                                <i className="fa fa-caret-down"></i>
                            </button>
                        </div>
                        <div className="dropdown-container" style={{ display: isTeacherOpen ? 'block' : 'none' }}>
                            {/* Admin teacher links */}
                            {role === 'admin' && (
                                <>
                                    <div className="sub-link"><Link to="/teachers"><i className="fa fa-caret-right"></i>All Teachers</Link></div>
                                    <div className="sub-link"><Link to="/teachers/add"><i className="fa fa-caret-right"></i>Add Teachers</Link></div>
                                </>
                            )}
                            {/* Teacher link (if needed in future) */}
                            {role === 'teacher' && (
                                <div className="sub-link"><Link to="/teachers"><i className="fa fa-caret-right"></i>All Teachers</Link></div>
                            )}
                        </div>
                    </div>
                )}

                {/* Account dropdown for admin and parent */}
                {(role === 'admin') && (
                    <div className="link Account">
                        <div className="account-svg">
                            <button onClick={handleonClickAccounts} className={`dropdown-btn ${isAccountsOpen ? 'active' : ""}`}>
                                <svg width="30" height="24" fill="none"><path d="..." /></svg>
                                <span>Account</span>
                                <i className="fa fa-caret-down"></i>
                            </button>
                        </div>
                        <div className="dropdown-container" style={{ display: isAccountsOpen ? 'block' : 'none' }}>
                            {/* Admin account links */}
                            {role === 'admin' && (
                                <>
                                    <div className="sub-link"><Link to="/account/fees-group"><i className="fa fa-caret-right"></i>Fees Group</Link></div>
                                    <div className="sub-link"><Link to="/account/student-fees"><i className="fa fa-caret-right"></i>Student Fees</Link></div>
                                    <div className="sub-link"><Link to="/account/expenses"><i className="fa fa-caret-right"></i>Expenses</Link></div>
                                    <div className="sub-link"><Link to="/account/add"><i className="fa fa-caret-right"></i>Add Expenses</Link></div>
                                </>
                            )}
                            {/* Parent account link */}
                            {role === 'parent' && (
                                <div className="sub-link"><Link to="/account/student-fees"><i className="fa fa-caret-right"></i>Student Fees</Link></div>
                            )}
                        </div>
                    </div>
                )}

                {/* Subjects link for admin, teacher, and student */}
                {(role === 'admin' || role === 'teacher' || role === 'student') && (
                    <div className="link Subject">
                        <Link to="/subjects">
                            <svg width="30" height="24" fill="none"><path d="..." /></svg>
                            <span>Subjects</span>
                        </Link>
                    </div>
                )}

                {/* Settings link for admin */}
                {role === 'admin' && (
                    <div className="link Settings">
                        <Link to="/settings">
                            <svg width="30" height="24" fill="none"><path d="..." /></svg>
                            <span>Settings</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
