import Footer from "../../components/footer";
import Headerbar from "../../components/header";
import "./parent.css";
import { axiosInstance } from "../../lib/axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditParentModal from './EditParentModal';

// Modal component to show parent details in a profile card
const ParentDetailsModal = ({ isOpen, onClose, parentData, isLoading, error }) => {
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
                {isLoading && <p className="modal-loading">Loading parent details...</p>}
                {error && <p className="modal-error">Error: {error.message || "Failed to load parent details."}</p>}

                {/* Parent details card */}
                {parentData && !isLoading && (
                    <div className="parent-profile-card">
                        <div className="profile-header">
                            <div className="profile-info-text">
                                <h2>{parentData.fatherName}</h2>
                                <p>{parentData.description || "Parent Information"}</p>
                            </div>
                        </div>

                        <div className="profile-details-grid">
                            {/* Father Name */}
                            <div className="detail-item">
                                <span className="detail-label">Father Name:</span>
                                <span className="detail-value">{parentData.fatherName || '-'}</span>
                            </div>
                            {/* Mother Name */}
                            <div className="detail-item">
                                <span className="detail-label">Mother Name:</span>
                                <span className="detail-value">{parentData.motherName || '-'}</span>
                            </div>
                            {/* Father Occupation */}
                            <div className="detail-item">
                                <span className="detail-label">Father Occupation:</span>
                                <span className="detail-value">{parentData.fatherOccupation || '-'}</span>
                            </div>
                            {/* Address */}
                            <div className="detail-item">
                                <span className="detail-label">Address:</span>
                                <span className="detail-value">{parentData.address || '-'}</span>
                            </div>
                            {/* Email */}
                            <div className="detail-item">
                                <span className="detail-label">E-mail:</span>
                                <span className="detail-value">{parentData.email || '-'}</span>
                            </div>
                            {/* Phone */}
                            <div className="detail-item">
                                <span className="detail-label">Phone:</span>
                                <span className="detail-value">{parentData.phone || '-'}</span>
                            </div>
                            {/* Children */}
                            <div className="detail-item">
                                <span className="detail-label">Children:</span>
                                <span className="detail-value">
                                    {parentData.children && parentData.children.length > 0
                                        ? parentData.children.map(child => child.name).join(", ")
                                        : 'No children listed'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDetailsModal;