import React from 'react';
import './ViewExpenseModal.css';

// Modal component to view expense details
const ViewExpenseModal = ({ isOpen, onClose, expenseData }) => {
    // Do not render modal if not open or no data
    if (!isOpen || !expenseData) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Expense Details</h2>
                    {/* Close button */}
                    <button onClick={onClose} className="close-button">×</button>
                </div>
                <div className="modal-body">
                    <div className="details-grid">
                        {/* Name */}
                        <div className="detail-group">
                            <label>Name:</label>
                            <p>{expenseData.str_name}</p>
                        </div>
                        {/* Expense Type */}
                        <div className="detail-group">
                            <label>Expense Type:</label>
                            <p>{expenseData.str_expenseType}</p>
                        </div>
                        {/* Amount */}
                        <div className="detail-group">
                            <label>Amount:</label>
                            <p>${parseFloat(expenseData.num_amount).toFixed(2)}</p>
                        </div>
                        {/* Status */}
                        <div className="detail-group">
                            <label>Status:</label>
                            <div className={`status-pill ${expenseData.str_status.toLowerCase()}`}>
                                {expenseData.str_status}
                            </div>
                        </div>
                        {/* Email */}
                        <div className="detail-group">
                            <label>Email:</label>
                            <p>{expenseData.str_email}</p>
                        </div>
                        {/* Phone */}
                        <div className="detail-group">
                            <label>Phone:</label>
                            <p>{expenseData.str_phone}</p>
                        </div>
                        {/* Due Date */}
                        <div className="detail-group">
                            <label>Due Date:</label>
                            <p>{new Date(expenseData.date_dueDate).toLocaleDateString()}</p>
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

export default ViewExpenseModal;