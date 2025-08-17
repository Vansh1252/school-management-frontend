import React, { useEffect, useState } from "react";
import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addTeacher.css";

// Addteacher component for adding a new teacher
const Addteacher = () => {
    // State for class list
    const [classes, setClasses] = useState([]);
    // State for loading indicator
    const [loading, setLoading] = useState(false);
    // State for teacher form data
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        bloodGroup: "",
        religion: "",
        email: "",
        phoneNumber: "",
        classId: "",
        address: "",
        admissionDate: "",
        str_teacherPhoto: null
    });

    // State for photo file name and preview
    const [photoName, setPhotoName] = useState("No file chosen");
    const [photoPreview, setPhotoPreview] = useState(null);

    // Fetch class list on component mount
    useEffect(() => {
        fetchClasses();
    }, []);

    // Fetch available classes from backend
    const fetchClasses = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    // Handle input changes for all form fields and photo upload
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "str_teacherPhoto") {
            const file = files[0];
            setFormData({ ...formData, str_teacherPhoto: file });
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
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submit to add teacher
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare form data for multipart/form-data
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    form.append(key, value);
                }
            });

            await axiosInstance.post("/teacher/create", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Teacher added successfully");
            // Reset form after successful submission
            setFormData({
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                gender: "",
                dateOfBirth: "",
                bloodGroup: "",
                religion: "",
                email: "",
                phoneNumber: "",
                classId: "",
                address: "",
                admissionDate: "",
                str_teacherPhoto: null
            });
            setPhotoName("No file chosen");
            setPhotoPreview(null);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add teacher");
        }
        setLoading(false);
    };

    return (
        <>
            <div className='admin-dashboard'>
                <Headerbar />
                <div className='main-header'>
                    <h1>Teachers</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>Add Teacher</p>
                    </div>
                    <div className="add-teacher-container">
                        <h1>Add New Teacher</h1>

                        {/* Teacher add form */}
                        <form className="teacher-form-grid" onSubmit={handleSubmit}>
                            {/* First Row */}
                            <div className="form-group">
                                <label htmlFor="firstName">First Name *</label>
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name *</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender *</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Please Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date Of Birth *</label>
                                <div className="date-input-wrapper">
                                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                                    <i className="fa-regular fa-calendar-days calendar-icon"></i> {/* Calendar icon */}
                                </div>
                            </div>

                            {/* Second Row */}
                            <div className="form-group">
                                <label htmlFor="bloodGroup">Blood group *</label>
                                <input type="text" id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="religion">Religion *</label>
                                <select id="religion" name="religion" value={formData.religion} onChange={handleChange} required>
                                    <option value="">Please Select Religion</option>
                                    <option value="christianity">Christianity</option>
                                    <option value="islam">Islam</option>
                                    <option value="hinduism">Hinduism</option>
                                    <option value="buddhism">Buddhism</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">phoneNumber</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            </div>

                            {/* Third Row */}
                            <div className="form-group">
                                <label htmlFor="classId">Class *</label>
                                <select
                                    id="classId"
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    required
                                    disabled={classes.length === 0 || loading}
                                >
                                    <option value="">Please Select Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.int_grade} {cls.name ? `- ${cls.name}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address *</label>
                                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="admissionDate">Admission Date *</label>
                                <div className="date-input-wrapper">
                                    <input type="date" id="admissionDate" name="admissionDate" value={formData.admissionDate} onChange={handleChange} required />
                                    <i className="fa-regular fa-calendar-days calendar-icon"></i> {/* Calendar icon */}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">UserName *</label>
                                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input type="text" id="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            {/* Photo Upload Section */}
                            <div className="form-group photo-upload-section">
                                <label>Upload Teacher Photo (150px X 150px)</label>
                                <div className="photo-upload-area">
                                    <div className="photo-placeholder">
                                        {/* Display image preview here */}
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Teacher Preview" className="teacher-photo-preview" />
                                        ) : (
                                            <i className="fa-solid fa-user-tie fa-4x" style={{ color: '#ccc' }}></i> // Placeholder icon
                                        )}
                                    </div>
                                    <div className="file-input-wrapper">
                                        <label htmlFor="str_teacherPhoto" className="choose-file-btn">Choose File</label>
                                        <span className="file-name">{photoName}</span>
                                        <input
                                            type="file"
                                            id="str_teacherPhoto"
                                            name="str_teacherPhoto"
                                            accept="image/*"
                                            onChange={handleChange}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="form-actions">
                                {/* Save button */}
                                <button type="submit" className="save-btn1" disabled={loading || classes.length === 0}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                {/* Reset button to clear form fields and photo */}
                                <button type="reset" className="reset-btn" onClick={() => {
                                    setFormData({
                                        username: "",
                                        password: "",
                                        firstName: "",
                                        lastName: "",
                                        gender: "",
                                        dateOfBirth: "",
                                        bloodGroup: "",
                                        religion: "",
                                        email: "",
                                        phoneNumber: "",
                                        classId: "",
                                        address: "",
                                        admissionDate: "",
                                        str_teacherPhoto: null
                                    });
                                    setPhotoName("No file chosen");
                                    setPhotoPreview(null);
                                }} disabled={loading}>
                                    Reset
                                </button>
                            </div>
                            {/* Loading indicator */}
                            {loading && (
                                <div style={{ marginTop: "1rem", color: "#d60a0b" }}>
                                    Loading...
                                </div>
                            )}
                            {/* Show message if no classes available */}
                            {classes.length === 0 && !loading && (
                                <div style={{ marginTop: "1rem", color: "#d60a0b" }}>
                                    No classes available. Please add classes first.
                                </div>
                            )}
                        </form>
                        <Footer />
                        {/* Toast notifications */}
                        <ToastContainer position="top-right" autoClose={3000} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Addteacher;