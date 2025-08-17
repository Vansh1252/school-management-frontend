import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-toastify';
import './EditTeacherModal.css';

// Default form data for editing teacher
const defaultFormData = {
    str_firstName: '',
    str_lastName: '',
    str_gender: '',
    date_dateOfBirth: '',
    str_bloodGroup: '',
    str_religion: '',
    str_email: '',
    str_phoneNumber: '',
    str_address: '',
    date_admissionDate: '',
    str_teacherPhoto: null,
};

// Modal component for editing teacher details
const EditTeacherModal = ({ isOpen, onClose, teacherId }) => {
    // State for form data, loading, error, photo preview, and photo update flag
    const [formData, setFormData] = useState(defaultFormData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isPhotoUpdated, setIsPhotoUpdated] = useState(false);

    // Capitalize helper for religion field
    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    // Fetch teacher details when modal opens or teacherId changes
    useEffect(() => {
        if (isOpen && teacherId) {
            fetchTeacherDetails();
        }
    }, [isOpen, teacherId]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData(defaultFormData);
            setError(null);
            setPhotoPreview(null);
            setLoading(true);
            setIsPhotoUpdated(false);
        }
    }, [isOpen]);

    // Fetch teacher details from backend
    const fetchTeacherDetails = async () => {
        try {
            const response = await axiosInstance.get(`/teacher/details/${teacherId}`);
            if (response.data?.data) {
                const data = response.data.data;
                setFormData({
                    ...defaultFormData,
                    ...data,
                    str_religion: capitalize(data.str_religion),
                });

                // Set photo preview if available
                if (data.str_teacherPhoto) {
                    const photoPath = data.str_teacherPhoto;
                    setPhotoPreview(
                        photoPath.startsWith('http')
                            ? photoPath
                            : `http://localhost:3000${photoPath}`
                    );
                } else {
                    setPhotoPreview(null);
                }
            }
            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch teacher details');
            setLoading(false);
            toast.error('Failed to load teacher details');
        }
    };

    // Handle form submission to update teacher
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare update data
        const updateData = {
            firstName: formData.str_firstName,
            lastName: formData.str_lastName,
            gender: formData.str_gender,
            dateOfBirth: formData.date_dateOfBirth,
            bloodGroup: formData.str_bloodGroup,
            religion: formData.str_religion,
            email: formData.str_email,
            phoneNumber: formData.str_phoneNumber,
            address: formData.str_address,
            admissionDate: formData.date_admissionDate,
        };

        try {
            if (isPhotoUpdated) {
                // If photo updated, send as multipart/form-data
                const form = new FormData();
                Object.entries(updateData).forEach(([key, value]) => {
                    if (value) form.append(key, value);
                });
                form.append('str_teacherPhoto', formData.str_teacherPhoto);

                await axiosInstance.put(`/teacher/update/${teacherId}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                // Otherwise, send as JSON
                await axiosInstance.put(`/teacher/update/${teacherId}`, updateData);
            }

            onClose(true); // Notify parent for success
            toast.success('Teacher updated successfully');
        } catch (err) {
            console.error('Update error:', err);
            toast.error(err.response?.data?.message || 'Failed to update teacher');
        }
    };

    // Handle input changes for form fields and photo upload
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'str_teacherPhoto' && files?.length) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, str_teacherPhoto: file }));
            setIsPhotoUpdated(true);

            // Show image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Do not render modal if not open
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Teacher</h2>
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
                            {/* First Name, Last Name, Blood Group, Email, Phone Number */}
                            {{
                                label: 'First Name',
                                name: 'str_firstName',
                                type: 'text',
                            }}
                            {{
                                label: 'Last Name',
                                name: 'str_lastName',
                                type: 'text',
                            }}
                            {{
                                label: 'Blood Group',
                                name: 'str_bloodGroup',
                                type: 'text',
                            }}
                            {{
                                label: 'Email',
                                name: 'str_email',
                                type: 'email',
                            }}
                            {{
                                label: 'Phone Number',
                                name: 'str_phoneNumber',
                                type: 'tel',
                            }}

                            {/* Gender select */}
                            <div className="form-group">
                                <label>Gender *</label>
                                <select
                                    name="str_gender"
                                    value={formData.str_gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Religion select */}
                            <div className="form-group">
                                <label>Religion *</label>
                                <select
                                    name="str_religion"
                                    value={formData.str_religion}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Religion</option>
                                    <option value="Hinduism">Hinduism</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Buddhism">Buddhism</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Date of Birth */}
                            <div className="form-group">
                                <label>Date of Birth *</label>
                                <input
                                    type="date"
                                    name="date_dateOfBirth"
                                    value={formData.date_dateOfBirth?.split('T')[0] || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Admission Date */}
                            <div className="form-group">
                                <label>Admission Date *</label>
                                <input
                                    type="date"
                                    name="date_admissionDate"
                                    value={formData.date_admissionDate?.split('T')[0] || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Address */}
                            <div className="form-group">
                                <label>Address *</label>
                                <textarea
                                    name="str_address"
                                    value={formData.str_address}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>

                        {/* Teacher photo upload */}
                        <div className="form-group photo-upload-section">
                            <label>Teacher Photo</label>
                            <div className="photo-upload-area">
                                <div className="photo-placeholder">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="teacher"
                                            className="teacher-photo-preview"
                                        />
                                    ) : (
                                        <i className="fa-solid fa-user-tie fa-4x" style={{ color: '#ccc' }}></i>
                                    )}
                                </div>
                                <div className="file-input-wrapper">
                                    <label htmlFor="str_teacherPhoto" className="choose-file-btn">
                                        Change Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="str_teacherPhoto"
                                        name="str_teacherPhoto"
                                        accept="image/*"
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form action buttons */}
                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                Update Teacher
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

export default EditTeacherModal;
