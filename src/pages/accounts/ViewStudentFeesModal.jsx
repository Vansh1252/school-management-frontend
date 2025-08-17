import React from 'react';
import './ViewStudentFeesModal.css';

// Modal component to view student fees details
const ViewStudentFeesModal = ({ isOpen, onClose, feeData }) => {
    // Do not render modal if not open or no data
    if (!isOpen || !feeData) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Student Fees Details</h2>
                    {/* Close button */}
                    <button onClick={onClose} className="close-button">×</button>
                </div>
                <div className="modal-body">
                    <div className="details-grid">
                        {/* Student ID */}
                        <div className="detail-group">
                            <label>Student ID:</label>
                            <p>{feeData.int_idNumber}</p>
                        </div>
                        {/* Name */}
                        <div className="detail-group">
                            <label>Name:</label>
                            <p>{feeData.str_name}</p>
                        </div>
                        {/* Class */}
                        <div className="detail-group">
                            <label>Class:</label>
                            <p>{feeData.objectId_classId?.int_grade ?
                                `Grade ${feeData.objectId_classId.int_grade}` : 'N/A'}</p>
                        </div>
                        {/* Total Fees */}
                        <div className="detail-group">
                            <label>Total Fees:</label>
                            <p>${feeData.int_totalFees}</p>
                        </div>
                        {/* Paid Fees */}
                        <div className="detail-group">
                            <label>Paid Fees:</label>
                            <p>${feeData.int_paidFees || 0}</p>
                        </div>
                        {/* Status */}
                        <div className="detail-group">
                            <label>Status:</label>
                            <div className={`status-pill ${feeData.str_feesStatus?.toLowerCase()}`}>
                                {feeData.str_feesStatus}
                            </div>
                        </div>
                        {/* Parent Name */}
                        <div className="detail-group">
                            <label>Parent Name:</label>
                            <p>{feeData.objectId_parentId?.str_fatherName}</p>
                        </div>
                        {/* Parent Email */}
                        <div className="detail-group">
                            <label>Parent Email:</label>
                            <p>{feeData.objectId_parentId?.str_email}</p>
                        </div>
                        {/* Parent Phone */}
                        <div className="detail-group">
                            <label>Parent Phone:</label>
                            <p>{feeData.objectId_parentId?.str_phoneNumber}</p>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    {/* Close modal button */}
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewStudentFeesModal;