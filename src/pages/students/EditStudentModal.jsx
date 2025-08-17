import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-toastify';
import './EditStudentModel.css'

// Modal component for editing student details
const EditStudentModal = ({ isOpen, onClose, studentId }) => {
    // State for form data, loading, error, class list, and photo preview
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classes, setClasses] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Fetch student details and class list when modal opens
    useEffect(() => {
        if (isOpen && studentId) {
            setLoading(true);
            fetchStudentDetails();
            fetchClasses();
        }
    }, [isOpen, studentId]);

    // Fetch available classes from backend
    const fetchClasses = async () => {
        try {
            const response = await axiosInstance.get('/classes/master');
            if (response.data && Array.isArray(response.data.classes)) {
                setClasses(response.data.classes);
            }
        } catch (err) {
            toast.error('Failed to fetch class list');
        }
    };

    // Fetch student details from backend
    const fetchStudentDetails = async () => {
        try {
            const response = await axiosInstance.get(`/student/details/${studentId}`);
            const student = response.data?.data;
            if (student) {
                // Convert class object to just classId string for easier form handling
                const normalizedData = {
                    ...student,
                    objectId_classId: student.objectId_classId?._id || '', // just string id
                };

                setFormData(normalizedData);

                // Set photo preview if available and not File object
                if (student.str_studentPhoto && !(student.str_studentPhoto instanceof File)) {
                    // If the path does not start with http, prepend your backend URL
                    const photoPath = student.str_studentPhoto;
                    setPhotoPreview(
                        photoPath.startsWith("http")
                            ? photoPath
                            : `http://localhost:3000${photoPath}` // <-- use your backend URL here
                    );
                } else {
                    setPhotoPreview(null);
                }
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch student details');
            setLoading(false);
            toast.error('Failed to load student details');
        }
    };

    // Handle input changes for form fields and photo upload
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'str_studentPhoto' && files?.length) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, str_studentPhoto: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission to update student
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                str_name: formData.str_name,
                str_gender: formData.str_gender,
                objectId_classId: formData.objectId_classId,
                str_dateOfBirth: formData.str_dateOfBirth,
                str_bloodGroup: formData.str_bloodGroup,
                str_religion: formData.str_religion,
                date_admissionDate: formData.date_admissionDate,
            };

            if (formData.str_studentPhoto instanceof File) {
                // If user selected a new photo, send FormData (file + data)
                const form = new FormData();
                Object.entries(updateData).forEach(([key, val]) => {
                    if (val !== undefined && val !== null) form.append(key, val);
                });
                form.append('str_studentPhoto', formData.str_studentPhoto);

                const response = await axiosInstance.put(
                    `/student/update/${studentId}`,
                    form,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                handleUpdateSuccess(response);
            } else {
                // If photo not changed, just send JSON data (no photo field)
                const response = await axiosInstance.put(
                    `/student/update/${studentId}`,
                    updateData,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                handleUpdateSuccess(response);
            }
        } catch (err) {
            console.error('Update error:', err);
            const msg = err.response?.data?.message || 'Failed to update student';
            toast.error(msg);
        }
    };

    // Handle successful update
    const handleUpdateSuccess = (response) => {
        toast.success(response.data?.message || 'Student updated successfully');
        onClose(true); // notify parent for success
    };

    // Do not render modal if not open
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Student</h2>
                    {/* Close button */}
                    <button onClick={() => onClose(false)} className="close-button">
                        ×
                    </button>
                </div>

                {/* Show loader, error, or form */}
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-grid">
                            {/* Name */}
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
                            {/* Gender */}
                            <div className="form-group">
                                <label>Gender *</label>
                                <select
                                    name="str_gender"
                                    value={formData?.str_gender || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            {/* Class */}
                            <div className="form-group">
                                <label>Class *</label>
                                <select
                                    name="objectId_classId"
                                    value={formData?.objectId_classId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.int_grade} {cls.name ? `- ${cls.name}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Date Of Birth */}
                            <div className="form-group">
                                <label>Date Of Birth *</label>
                                <input
                                    type="date"
                                    name="str_dateOfBirth"
                                    value={formData?.str_dateOfBirth?.split('T')[0] || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Blood Group */}
                            <div className="form-group">
                                <label>Blood Group *</label>
                                <input
                                    type="text"
                                    name="str_bloodGroup"
                                    value={formData?.str_bloodGroup || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Religion */}
                            <div className="form-group">
                                <label>Religion *</label>
                                <select
                                    name="str_religion"
                                    value={formData?.str_religion || ''}
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
                            {/* Admission Date */}
                            <div className="form-group">
                                <label>Admission Date *</label>
                                <input
                                    type="date"
                                    name="date_admissionDate"
                                    value={formData?.date_admissionDate?.split('T')[0] || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* ID Number (disabled) */}
                            <div className="form-group">
                                <label>ID Number</label>
                                <input
                                    type="number"
                                    name="int_idNumber"
                                    value={formData?.int_idNumber || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                            {/* Fees Status (disabled) */}
                            <div className="form-group">
                                <label>Fees Status</label>
                                <input
                                    type="text"
                                    name="str_feesStatus"
                                    value={formData?.str_feesStatus || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>
                        {/* Student photo upload */}
                        <div className="form-group photo-upload-section">
                            <label>Student Photo</label>
                            <div className="photo-upload-area">
                                <div className="photo-placeholder">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="student"
                                            className="student-photo-preview"
                                        />
                                    ) : (
                                        <i
                                            className="fa-solid fa-user-tie fa-4x"
                                            style={{ color: '#ccc' }}
                                        ></i>
                                    )}
                                </div>
                                <div className="file-input-wrapper">
                                    <label htmlFor="str_studentPhoto" className="choose-file-btn">
                                        Change Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="str_studentPhoto"
                                        name="str_studentPhoto"
                                        accept="image/*"
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Form action buttons */}
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                Update Student
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

export default EditStudentModal;
