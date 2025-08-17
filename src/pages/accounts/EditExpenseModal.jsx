import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-toastify';

// EditExpenseModal component for editing an expense entry
const EditExpenseModal = ({ isOpen, onClose, expenseId, expenseData }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize form data when modal opens and expenseData is available
    useEffect(() => {
        if (isOpen && expenseData) {
            // Use the passed expense data directly
            setFormData({
                str_name: expenseData.str_name,
                str_expenseType: expenseData.str_expenseType,
                num_amount: expenseData.num_amount,
                str_status: expenseData.str_status,
                str_email: expenseData.str_email,
                str_phone: expenseData.str_phone,
                date_dueDate: expenseData.date_dueDate?.split('T')[0]
            });
            setLoading(false);
        }
    }, [isOpen, expenseData]);

    // Handle form submission for updating expense
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                name: formData.str_name,
                expenseType: formData.str_expenseType,
                amount: formData.num_amount,
                status: formData.str_status,
                email: formData.str_email,
                phone: formData.str_phone,
                dueDate: formData.date_dueDate
            };
            await axiosInstance.put(`/expense/update/${expenseId}`, updateData);
            toast.success('Expense updated successfully');
            onClose(true); // Close modal and signal update
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update expense');
        }
    };

    // Handle input changes for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Do not render modal if not open
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Expense</h2>
                    {/* Close button */}
                    <button onClick={() => onClose(false)} className="close-button">×</button>
                </div>

                {/* Show loader, error, or form */}
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-grid">
                            {/* Name field */}
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="str_name"
                                    value={formData?.str_name || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Expense Type field */}
                            <div className="form-group">
                                <label>Expense Type *</label>
                                <input
                                    type="text"
                                    name="str_expenseType"
                                    value={formData?.str_expenseType || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Amount field */}
                            <div className="form-group">
                                <label>Amount *</label>
                                <input
                                    type="number"
                                    name="num_amount"
                                    value={formData?.num_amount || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Status dropdown */}
                            <div className="form-group">
                                <label>Status *</label>
                                <select
                                    name="str_status"
                                    value={formData?.str_status || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </div>
                            {/* Email field */}
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="str_email"
                                    value={formData?.str_email || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Phone field */}
                            <div className="form-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    name="str_phone"
                                    value={formData?.str_phone || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Due Date field */}
                            <div className="form-group">
                                <label>Due Date *</label>
                                <input
                                    type="date"
                                    name="date_dueDate"
                                    value={formData?.date_dueDate?.split('T')[0] || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Form action buttons */}
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                Update Expense
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => onClose(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditExpenseModal;