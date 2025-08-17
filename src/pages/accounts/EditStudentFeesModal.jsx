import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-toastify';
import './EditStudentFeesModal.css';

// Modal component for editing student fees details
const EditStudentFeesModal = ({ isOpen, onClose, feeData }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch fee details when modal opens and feeData is available
    useEffect(() => {
        if (isOpen && feeData?._id) {
            fetchFeesDetails(feeData._id);
        }
    }, [isOpen, feeData]);

    // Fetch student fees details from backend
    const fetchFeesDetails = async (studentId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/student/fees/${studentId}`);
            const data = response.data.data;
            setFormData({
                total_fees: data.feesDetails.totalFees,
                paidfees: 0, // Start with 0 for new payment
                remaining_fees: data.feesDetails.remainingFees, // Store original remaining fees
                status: data.feesDetails.status,
                studentName: data.studentName,
                className: data.class?.str_name,
                classGrade: data.class?.int_grade,
                feesGroup: data.feesGroup?.str_name,
                original_remaining: data.feesDetails.remainingFees // Store original remaining for reference
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch fees details');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission to update fees
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = {
                total_fees: formData.total_fees,
                paidfees: formData.paidfees,
                remaining_fees: formData.remaining_fees,
                status: formData.status
            };

            await axiosInstance.put(`/student/update/fees/${feeData._id}`, updateData);
            toast.success('Fees details updated successfully');
            onClose(true); // Close modal and signal update
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update fees');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes and update remaining fees/status accordingly
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newValue = ['total_fees', 'paidfees', 'remaining_fees'].includes(name)
                ? Number(value)
                : value;
            const updates = { [name]: newValue };

            // Calculate remaining fees based on the original remaining fees and new paid amount
            if (name === 'paidfees') {
                const newPaidAmount = Number(value);
                // Get the remaining fees from backend and subtract new paid amount
                updates.remaining_fees = prev.remaining_fees - newPaidAmount;

                // Update status based on remaining amount
                if (updates.remaining_fees <= 0) {
                    updates.status = 'Paid';
                } else {
                    updates.status = 'Unpaid';
                }
            }

            return { ...prev, ...updates };
        });
    };

    // Do not render modal if not open
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Fees Details</h2>
                    {/* Close button */}
                    <button onClick={() => onClose(false)} className="close-button">×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="edit-form">
                        {/* Student/class/fees group info */}
                        <div className="form-info">
                            <div className="info-group">
                                <label>Student Name:</label>
                                <span>{formData?.studentName}</span>
                            </div>
                            <div className="info-group">
                                <label>Class:</label>
                                <span>Grade {formData?.classGrade} {formData?.className}</span>
                            </div>
                            <div className="info-group">
                                <label>Fees Group:</label>
                                <span>{formData?.feesGroup}</span>
                            </div>
                        </div>

                        {/* Editable fields */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Total Fees</label>
                                <input
                                    type="number"
                                    value={formData?.total_fees || ''}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Original Remaining Fees</label>
                                <input
                                    type="number"
                                    value={formData?.original_remaining || ''}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>New Payment Amount *</label>
                                <input
                                    type="number"
                                    name="paidfees"
                                    value={formData?.paidfees || ''}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max={formData?.original_remaining || 0}
                                />
                            </div>
                            <div className="form-group">
                                <label>Remaining After Payment</label>
                                <input
                                    type="number"
                                    value={formData?.remaining_fees || ''}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={formData?.status || ''}
                                    onChange={handleChange}
                                    required
                                    disabled
                                >
                                    <option value="">Select Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </div>
                        </div>

                        {/* Form action buttons */}
                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Fees'}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => onClose(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditStudentFeesModal;