import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-toastify';
import './EditParentModal.css';

// Modal component for editing parent details
const EditParentModal = ({ isOpen, onClose, parentId }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch parent details when modal opens and parentId is available
    useEffect(() => {
        if (isOpen && parentId) {
            fetchParentDetails();
        }
    }, [isOpen, parentId]);

    // Fetch parent details from backend
    const fetchParentDetails = async () => {
        try {
            const response = await axiosInstance.get(`/parent/details/${parentId}`);
            if (response.data?.data) {
                setFormData(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to fetch parent details');
            setLoading(false);
            toast.error('Failed to load parent details');
        }
    };

    // Handle form submission to update parent
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                fatherName: formData.str_fatherName,
                motherName: formData.str_motherName,
                fatherOccupation: formData.str_fatherOccupation,
                address: formData.str_address,
                email: formData.str_email,
                phoneNumber: formData.str_phoneNumber
            };

            await axiosInstance.put(`/parent/update/${parentId}`, updateData);
            toast.success('Parent updated successfully');
            onClose(true);
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update parent');
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
                    <h2>Edit Parent</h2>
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
                            {/* Father's Name */}
                            <div className="form-group">
                                <label>Father's Name *</label>
                                <input
                                    type="text"
                                    name="str_fatherName"
                                    value={formData?.str_fatherName || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Mother's Name */}
                            <div className="form-group">
                                <label>Mother's Name *</label>
                                <input
                                    type="text"
                                    name="str_motherName"
                                    value={formData?.str_motherName || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Father's Occupation */}
                            <div className="form-group">
                                <label>Father's Occupation *</label>
                                <input
                                    type="text"
                                    name="str_fatherOccupation"
                                    value={formData?.str_fatherOccupation || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Address */}
                            <div className="form-group">
                                <label>Address *</label>
                                <textarea
                                    name="str_address"
                                    value={formData?.str_address || ''}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                />
                            </div>
                            {/* Email */}
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
                            {/* Phone Number */}
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="str_phoneNumber"
                                    value={formData?.str_phoneNumber || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Form action buttons */}
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                Update Parent
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

export default EditParentModal;