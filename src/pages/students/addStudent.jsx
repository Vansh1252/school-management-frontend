import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './addstudent.css';
import Loader from '../../components/Loader';

// AddStudent component for adding a new student and parent info
const AddStudent = () => {
    // State for class list
    const [classes, setClasses] = useState([]);
    // State for student and parent form data
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        gender: "",
        classId: "",
        dateOfBirth: "",
        bloodGroup: "",
        religion: "",
        admissionDate: "",
        str_studentPhoto: null,
        fatherName: "",
        motherName: "",
        email: "",
        phoneNumber: "",
        fatherOccupation: "",
        address: "",
    });

    // State for photo file name and preview
    const [photoName, setPhotoName] = useState("No file chosen");
    const [photoPreview, setPhotoPreview] = useState(null);
    // State for loading indicator
    const [loading, setLoading] = useState(false);

    // Fetch class list on component mount
    useEffect(() => {
        fetchClasses();
    }, []);

    // Fetch available classes from backend
    const fetchClasses = async () => {
        try {
            const response = await axiosInstance.get("/classes/master");
            if (response.data && Array.isArray(response.data.classes) && response.data.classes.length > 0) {
                setClasses(response.data.classes);
            } else {
                setClasses([]);
                toast.error("No classes found. Please add classes first.");
            }
        } catch (error) {
            setClasses([]);
            toast.error("Failed to fetch class list");
        }
    };

    // Handle input changes for all form fields
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Handle photo file input
        if (name === "str_studentPhoto") {
            const file = files[0];
            setFormData(prev => ({ ...prev, str_studentPhoto: file }));
            setPhotoName(file ? file.name : "No file chosen");

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPhotoPreview(null);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submit to add student
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loader
        try {
            // Prepare form data for multipart/form-data
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    form.append(key, value);
                }
            });

            const response = await axiosInstance.post("/student/create", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(response.data.message || "Student added successfully");

            // Reset form after successful submission
            setFormData({
                username: "",
                password: "",
                name: "",
                gender: "",
                classId: "",
                dateOfBirth: "",
                bloodGroup: "",
                religion: "",
                admissionDate: "",
                str_studentPhoto: null,
                fatherName: "",
                motherName: "",
                email: "",
                phoneNumber: "",
                fatherOccupation: "",
                address: "",
            });

            setPhotoName("No file chosen");
            setPhotoPreview(null);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add student");
        }
        setLoading(false); // Stop loader
    };

    return (
        <div className='admin-dashboard'>
            {/* Toast notifications */}
            <ToastContainer />
            <Headerbar />
            <div className='main-header'>
                <h1>Students</h1>
                <div className="reds-line"></div>
                <div className='accounts-expense'>
                    <p>Home</p>
                    <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                    <p style={{ color: "red" }}>Student Admit Form</p>
                </div>
                <div className='add-students'>
                    <h3>Add New Student</h3>
                    {/* Student and parent form */}
                    <form className='student-grid' onSubmit={handleSubmit}>
                        <div className='gird-students'>
                            {/* Student name */}
                            <div className='from-control-1'>
                                <label> Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            {/* Gender select */}
                            <div className='from-control-1'>
                                <label>Gender *</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* Class select */}
                            <div className='from-control-1'>
                                <label>Class *</label>
                                <select
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    required
                                    disabled={classes.length === 0}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.int_grade} {cls.name ? `- ${cls.name}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Date of Birth */}
                            <div className='from-control-1'>
                                <label>Date Of Birth *</label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                            </div>
                            {/* Blood Group */}
                            <div className='from-control-1'>
                                <label>Blood Group *</label>
                                <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />
                            </div>
                            {/* Religion select */}
                            <div className='from-control-1'>
                                <label>Religion *</label>
                                <select name="religion" value={formData.religion} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Hinduism">Hinduism</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Buddhism">Buddhism</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* Admission Date */}
                            <div className='from-control-1'>
                                <label>Admission Date *</label>
                                <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} required />
                            </div>
                            {/* Username */}
                            <div className='from-control-1'>
                                <label>Username *</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                            </div>
                            {/* Password */}
                            <div className='from-control-1'>
                                <label>Password *</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <h3>Add Parent Information</h3>
                        <div className='gird-students'>
                            {/* Father Name */}
                            <div className='from-control-1'>
                                <label>Father Name *</label>
                                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                            </div>
                            {/* Mother Name */}
                            <div className='from-control-1'>
                                <label>Mother Name *</label>
                                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required />
                            </div>
                            {/* Parent Email */}
                            <div className='from-control-1'>
                                <label>Parent Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            {/* Phone Number */}
                            <div className='from-control-1'>
                                <label>Phone Number *</label>
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                            </div>
                            {/* Father's Occupation */}
                            <div className='from-control-1'>
                                <label>Father's Occupation *</label>
                                <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} required />
                            </div>
                            {/* Parent Address */}
                            <div className='from-control-1'>
                                <label>Parent Address *</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Student photo upload */}
                        <div className="form-group photo-upload-section">
                            <label>Upload Student Photo (150px x 150px)</label>
                            <div className="photo-upload-area">
                                <div className="photo-placeholder">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="student" className="student-photo-preview" />
                                    ) : (
                                        <i className="fa-solid fa-user-tie fa-4x" style={{ color: '#ccc' }}></i>
                                    )}
                                </div>
                                <div className="file-input-wrapper">
                                    <label htmlFor="str_studentPhoto" className="choose-file-btn">Choose File</label>
                                    <span className="file-name">{photoName}</span>
                                    <input
                                        type="file"
                                        id="str_studentPhoto"
                                        name="str_studentPhoto"
                                        accept="image/*"
                                        onChange={handleChange}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form action buttons */}
                        <div className="form-actions">
                            {/* Save button */}
                            <button type="submit" className="save-btn" disabled={loading || classes.length === 0}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                            {/* Reset button to clear form fields and photo */}
                            <button type="reset" className="reset-btn1" onClick={() => {
                                setFormData({
                                    username: "", password: "", name: "",
                                    gender: "", classId: "", dateOfBirth: "", bloodGroup: "", religion: "",
                                    admissionDate: "", str_studentPhoto: null,
                                    fatherName: "", motherName: "", email: "", phoneNumber: "",
                                    fatherOccupation: "", address: ""
                                });
                                setPhotoName("No file chosen");
                                setPhotoPreview(null);
                            }} disabled={loading}>
                                Reset
                            </button>
                        </div>
                        {/* Loader while saving */}
                        {loading && (
                            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                <Loader />
                            </div>
                        )}
                        {/* Show message if no classes available */}
                        {classes.length === 0 && !loading && (
                            <div style={{ marginTop: "1rem", color: "#d60a0b" }}>
                                No classes available. Please add classes first.
                            </div>
                        )}
                    </form>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AddStudent;
