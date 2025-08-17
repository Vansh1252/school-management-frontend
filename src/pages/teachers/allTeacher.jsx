import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import "./allTeacher.css";
import { axiosInstance } from "../../lib/axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditTeacherModal from './EditTeacherModal';

// TeacherDetailsModal Component (within the same file)
const TeacherDetailsModal = ({ isOpen, onClose, teacherData, isLoading, error }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                {isLoading && <p className="modal-loading">Loading teacher details...</p>}
                {error && <p className="modal-error">Error: {error.message || "Failed to load teacher details."}</p>}

                {teacherData && !isLoading && (
                    <div className="teacher-profile-card">
                        <div className="school-logo">
                            <img src="/src/assets/logo.png" alt="School Logo" />
                        </div>

                        <div className="profile-header">
                            <div className="profile-photo-circle">
                                <img
                                    src={`http://localhost:3000${teacherData.str_teacherPhoto}`}
                                    className="student-photo"
                                    alt={teacherData.str_firstName + teacherData.str_lastName}
                                />
                            </div>
                            <div className="profile-info-text">
                                <h2>{teacherData.firstName} {teacherData.lastName}</h2>
                                <p>{teacherData.description || "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa"}</p>
                            </div>
                        </div>

                        <div className="profile-details-grid">
                            <div className="detail-item">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{teacherData.id || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">First Name:</span>
                                <span className="detail-value">{teacherData.firstName || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Last Name:</span>
                                <span className="detail-value">{teacherData.lastName || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Gender:</span>
                                <span className="detail-value">{teacherData.gender || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Date Of Birth:</span>
                                <span className="detail-value">{teacherData.dateOfBirth || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Address:</span>
                                <span className="detail-value">{teacherData.address || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">E-mail:</span>
                                <span className="detail-value">{teacherData.email || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Phone:</span>
                                <span className="detail-value">{teacherData.phone || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Joining Date:</span>
                                <span className="detail-value">{teacherData.joiningDate || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Teacher Component
const Teacher = () => {
    const [Teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    // State for edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTeacherId, setEditTeacherId] = useState(null);

    const fetchTeachers = async (page = 1, name = "", classId = "") => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/teacher?page=${page}&limit=10&name=${encodeURIComponent(
                    name
                )}&classId=${encodeURIComponent(classId)}`
            );
            setTeachers(response.data.getTeacherData || []);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
        } catch (error) {
            toast.error("Failed to fetch teachers.");
        }
        setLoading(false);
    };

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

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchTeachers(currentPage, search, selectedClassId);
    }, [currentPage, search, selectedClassId]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTeachers(1, search, selectedClassId);
    };

    const handleClassChange = (e) => {
        setSelectedClassId(e.target.value);
        setCurrentPage(1);
    };

    // Function to handle viewing teacher details
    const handleViewDetails = async (teacherId) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setModalError(null);
        setSelectedTeacher(null);

        try {
            const response = await axiosInstance.get(`/teacher/details/${teacherId}`);
            const teacherData = response.data.data || response.data;

            if (!teacherData) {
                throw new Error("Teacher data not found");
            }

            setSelectedTeacher({
                id: teacherData.int_idNumber,
                firstName: teacherData.str_firstName,
                lastName: teacherData.str_lastName,
                gender: teacherData.str_gender,
                dateOfBirth: teacherData.date_dateOfBirth,
                address: teacherData.str_address || 'N/A',
                email: teacherData.str_email || 'N/A',
                phone: teacherData.str_phoneNumber || 'N/A',
                joiningDate: teacherData.date_admissionDate,
                str_teacherPhoto: teacherData.str_teacherPhoto,
                description: teacherData.str_description || "No description available"
            });
        } catch (error) {
            console.error("Failed to fetch teacher details:", error);
            setModalError(new Error("Failed to load teacher details."));
            toast.error("Failed to load teacher details.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTeacher(null);
        setModalError(null);
    };

    const handleEditClick = (e, teacherId) => {
        e.stopPropagation(); // Prevent row click event
        setEditTeacherId(teacherId);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = (wasUpdated) => {
        setIsEditModalOpen(false);
        setEditTeacherId(null);
        if (wasUpdated) {
            // Refresh the teachers list
            fetchTeachers(currentPage, search, selectedClassId);
        }
    };

    return (
        <div className='admin-dashboard'>
            <ToastContainer />
            <Headerbar />
            <div className="main-header">
                <h1>Teachers</h1>
                <div className="reds-line"></div>
                <div className='accounts-expense'>
                    <p>Home</p>
                    <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                    <p style={{ color: "red" }}>All Teachers</p>
                </div>
                <div className="Teachers-layout">
                    <div className="Teachers-table-section">
                        <h3 className="Teachers-heading">All Teachers Data</h3>
                        <form className="Teachers-search-form" onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="Teachers-search-input"
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className="Teachers-class-dropdown"
                                value={selectedClassId}
                                onChange={handleClassChange}
                                disabled={classes.length === 0}
                            >
                                <option value="">All Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.int_grade} {cls.name ? `- ${cls.name}` : ""}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="Teachers-search-button" disabled={classes.length === 0}>
                                Search
                            </button>
                        </form>
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "2rem" }}>
                                Loading...
                            </div>
                        ) : (
                            <>
                                <table className="Teachers-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Gender</th>
                                            <th>Address</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Teachers.length > 0 ? (
                                            Teachers.map((teacher, index) => (
                                                <tr 
                                                    key={teacher._id || index} 
                                                    onClick={(e) => {
                                                        // Only trigger view details if not clicking an action button
                                                        if (!e.target.closest('.action-buttons')) {
                                                            handleViewDetails(teacher._id);
                                                        }
                                                    }}
                                                >
                                                    <td>{index + 1}</td>
                                                    <td>{teacher.str_firstName}</td>
                                                    <td>{teacher.str_lastName}</td>
                                                    <td>{teacher.str_gender}</td>
                                                    <td>{teacher.str_address}</td>
                                                    <td>{teacher.str_email}</td>
                                                    <td>{teacher.str_phoneNumber}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <i 
                                                                className="fa-solid fa-eye"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewDetails(teacher._id);
                                                                }}
                                                                title="View Details"
                                                            ></i>
                                                            <i 
                                                                className="fa-solid fa-pen-to-square"
                                                                onClick={(e) => handleEditClick(e, teacher._id)}
                                                                title="Edit Teacher"
                                                            ></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} style={{ textAlign: "center" }}>
                                                    No Teachers found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="expense-pagination">
                                    {/* Pagination controls */}
                                    <button
                                        className="pagination-button"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="pagination-button"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                                {/* Show message if no classes available */}
                                {classes.length === 0 && !loading && (
                                    <div style={{ marginTop: "1rem", color: "#d60a0b", textAlign: "center" }}>
                                        No classes available. Please add classes first.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <Footer />
            </div>

            {/* Teacher details modal */}
            <TeacherDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                teacherData={selectedTeacher}
                isLoading={modalLoading}
                error={modalError}
            />
            {/* Edit teacher modal */}
            <EditTeacherModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                teacherId={editTeacherId}
            />
        </div>
    );
};

export default Teacher;