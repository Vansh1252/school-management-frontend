// studentdetails.jsx (Your StudentDetailsModal component)

import React from 'react';
import './studentdetails.css';

// Modal component to show student details in a profile card
const StudentDetailsModal = ({ isOpen, onClose, studentData, isLoading, error }) => {
    // Do not render modal if not open
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Close button */}
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                {/* Loading and error states */}
                {isLoading && <p className="modal-loading">Loading student details...</p>}
                {error && <p className="modal-error">Error: {error.message || "Failed to load student details."}</p>}

                {/* Student details card */}
                {studentData && !isLoading && (
                    <div className="student-profile-card">
                        <div className="school-logo">
                            {/* School logo (replace with your logo path if needed) */}
                            <img src="src\assets\logo.png" alt="School Logo" />
                        </div>

                        <div className="profile-header">
                            <div className="profile-photo-circle">
                                {/* Student photo */}
                                <img
                                    src={`http://localhost:3000${studentData.str_studentPhoto}`}
                                    className="student-photo"
                                    alt={studentData.name}
                                />
                            </div>
                            <div className="profile-info-text">
                                <h2>{studentData.name}</h2>
                                <p>{studentData.description || "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa"}</p>
                            </div>
                        </div>

                        <div className="profile-details-grid">
                            {/* ID Number */}
                            <div className="detail-item">
                                <span className="detail-label">ID Number:</span>
                                {/* Use studentData.id as mapped in AllStudent.jsx */}
                                <span className="detail-value">{studentData.id || '-'}</span>
                            </div>
                            {/* Name */}
                            <div className="detail-item">
                                <span className="detail-label">Name:</span>
                                <span className="detail-value">{studentData.name || '-'}</span>
                            </div>
                            {/* Gender */}
                            <div className="detail-item">
                                <span className="detail-label">Gender:</span>
                                <span className="detail-value">{studentData.gender || '-'}</span>
                            </div>
                            {/* Father Name */}
                            <div className="detail-item">
                                <span className="detail-label">Father Name:</span>
                                <span className="detail-value">{studentData.fatherName || '-'}</span>
                            </div>
                            {/* Mother Name */}
                            <div className="detail-item">
                                <span className="detail-label">Mother Name:</span>
                                <span className="detail-value">{studentData.motherName || '-'}</span>
                            </div>
                            {/* Date Of Birth */}
                            <div className="detail-item">
                                <span className="detail-label">Date Of Birth:</span>
                                <span className="detail-value">{studentData.dateOfBirth || '-'}</span>
                            </div>
                            {/* Religion */}
                            <div className="detail-item">
                                <span className="detail-label">Religion:</span>
                                <span className="detail-value">{studentData.religion || '-'}</span>
                            </div>
                            {/* Father Occupation */}
                            <div className="detail-item">
                                <span className="detail-label">Father Occupation:</span>
                                <span className="detail-value">{studentData.fatherOccupation || '-'}</span>
                            </div>
                            {/* E-mail */}
                            <div className="detail-item">
                                <span className="detail-label">E-mail:</span>
                                <span className="detail-value">{studentData.email || '-'}</span>
                            </div>
                            {/* Admission Date */}
                            <div className="detail-item">
                                <span className="detail-label">Admission Date:</span>
                                <span className="detail-value">{studentData.admissionDate || '-'}</span>
                            </div>
                            {/* Class */}
                            <div className="detail-item">
                                <span className="detail-label">Class:</span>
                                <span className="detail-value">{studentData.class || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetailsModal;