import React, { useEffect, useState } from "react";
import "./MyAccount.css";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function MyAccount() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/user")
            .then(res => setUser(res.data?.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (user) {
            setPhotoPreview(
                user.profile_photo?.startsWith("http")
                    ? user.profile_photo
                    : user.profile_photo
                        ? `http://localhost:3000${user.profile_photo}`
                        : "/default-profile.png"
            );
        }
    }, [user]);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoUpdate = async (e) => {
        e.preventDefault();
        if (!photoFile) {
            setMessage("Please select a photo to upload.");
            return;
        }
        setUpdating(true);
        setMessage("");
        try {
            const fd = new FormData();
            fd.append("profile_photo", photoFile);
            const response = await axiosInstance.put("/profile/photo", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Only update the photo in user state, keep other info
            if (response.data && response.data.profile_photo) {
                setUser(prev => ({
                    ...prev,
                    profile_photo: response.data.profile_photo
                }));
                setPhotoPreview(
                    response.data.profile_photo.startsWith("http")
                        ? response.data.profile_photo
                        : `http://localhost:3000${response.data.profile_photo}`
                );
            }
            setEditing(false);
            setPhotoFile(null);
            setMessage("Profile photo updated successfully!");
            setTimeout(function () {
                setMessage("");
            }, 1500)
        } catch (err) {
            setMessage("Failed to update profile photo.");
        }
        setUpdating(false);
    };

    if (loading) return <div className="myaccount-loading"><Loader /></div>;
    if (!user) return <div className="myaccount-error">User not found.</div>;

    return (
        <div className="myaccount-container">
            <div className="myaccount-card myaccount-card-large">
                <button className="myaccount-back-btn" onClick={() => navigate(-1)}>
                    ← Go Back
                </button>

                <div className="myaccount-photo-section">
                    <img
                        className="myaccount-photo"
                        src={photoPreview}
                        alt="Profile"
                        onError={e => { e.target.src = "/default-profile.png"; }}
                    />
                </div>

                {editing ? (
                    <form onSubmit={handlePhotoUpdate} className="myaccount-edit-form">
                        <div className="myaccount-form-row">
                            <label>Profile Photo</label>
                            <input type="file" name="profile_photo" accept="image/*" onChange={handlePhotoChange} />
                        </div>
                        <div className="myaccount-form-actions">
                            <button type="submit" disabled={updating}>{updating ? "Saving..." : "Save"}</button>
                            <button type="button" onClick={() => { setEditing(false); setPhotoFile(null); setPhotoPreview(user.profile_photo); }}>Cancel</button>
                        </div>
                        {message && <div className="myaccount-message">{message}</div>}
                    </form>
                ) : (
                    <>
                        <h2>{user.str_username}</h2>
                        <div className="myaccount-info-list">
                            <div><strong>Email:</strong> {user.str_email}</div>
                            <div><strong>Phone:</strong> {user.str_mobileNumber}</div>
                            <div><strong>Class:</strong> {user.profile?.objectId_classId?.int_grade || ""}</div>
                            <div><strong>Religion:</strong> {user.profile?.str_religion || ""}</div>
                            <div><strong>Blood Group:</strong> {user.profile?.str_bloodGroup || ""}</div>
                            <div><strong>Address:</strong> {user.str_address}</div>
                        </div>
                        <button className="myaccount-edit-btn" onClick={() => setEditing(true)}>Change Photo</button>
                        {message && <div className="myaccount-message">{message}</div>}
                    </>
                )}
            </div>
        </div>
    );
}

export default MyAccount;
