import Footer from "../components/footer"
import Headerbar from "../components/header"
import React, { useState } from "react"
import { axiosInstance } from "../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './settings.css'

// Initial form state for admin settings
const initialForm = {
    schoolName: "",
    email: "",
    mobileNumber: "",
    city: "",
    address: "",
    username: "",
    password: "",
    language: "english",
    adminPhoto: null,
    name: "",
};

const Setting = () => {
    // State for form data, photo preview, and loading indicator
    const [formData, setFormData] = useState(initialForm);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes for all fields and photo upload
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "adminPhoto" && files && files[0]) {
            setFormData(prev => ({ ...prev, adminPhoto: files[0] }));
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(files[0]);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission to create/update admin account
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare form data for multipart/form-data
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) submitData.append(key, value);
            });
            const response = await axiosInstance.post("/create", submitData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Admin account created/updated successfully.");
            // Reset form and photo preview after success
            setFormData(initialForm);
            setPhotoPreview(null);
        } catch (error) {
            toast.error("Something went wrong.");
        }
        setLoading(false);
    };

    return (
        <>
            {/* Toast notifications */}
            <ToastContainer />
            <div className='admin-dashboard'>
                <Headerbar />
                <div className='main-header'>
                    <h1>Settings</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>Settings</p>
                    </div>
                    <div className="account-settings">
                        <div className="header-image">
                            <h2>Account Setting</h2>
                        </div>
                        <div className="profile-container">
                            {/* Profile photo preview */}
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile" className="profile-pic" />
                            ) : (
                                <div className="profile-pic-empty" />
                            )}
                            <p>
                                <strong>{formData.name || "Admin"}</strong> - Admin
                            </p>
                            {/* Settings form */}
                            <form className="settings-form" onSubmit={handleSubmit}>
                                <label>Profile Photo
                                    <input type="file" name="adminPhoto" accept="image/*" onChange={handleChange} />
                                </label>
                                <label>Name *
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                                </label>
                                <label>School Name *
                                    <input type="text" name="schoolName" required value={formData.schoolName} onChange={handleChange} />
                                </label>
                                <label>Email *
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                                </label>
                                <label>Mobile No
                                    <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                                </label>
                                <label>City
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} />
                                </label>
                                <label>Address
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                                </label>
                                <label>Username *
                                    <input type="text" name="username" required value={formData.username} onChange={handleChange} />
                                </label>
                                <label>Password *
                                    <input type="password" name="password" required value={formData.password} onChange={handleChange} />
                                </label>
                                <label>Language
                                    <select name="language" value={formData.language} onChange={handleChange}>
                                        <option>english</option>
                                        <option>hindi</option>
                                        <option>gujarati</option>
                                        <option>french</option>
                                    </select>
                                </label>
                                {/* Save button */}
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                {/* Loading indicator */}
                                {loading && (
                                    <div style={{ marginTop: "1rem", color: "#d60a0b" }}>
                                        Loading...
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Setting