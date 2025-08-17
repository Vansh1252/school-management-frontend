import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import "./allstudent.css";
import { axiosInstance } from "../../lib/axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentDetailsModal from './studentdetails';
import EditStudentModal from './EditStudentModal';
import Loader from '../../components/Loader'; // Loader for loading state

// AllStudent component for listing, searching, viewing, and editing students
const AllStudent = () => {
    // State for students, classes, pagination, search, loading, and modals
    const [Students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // State for student details modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    // State for edit student modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editStudentId, setEditStudentId] = useState(null);

    // Fetch students from backend with filters and pagination
    const fetchStudents = async (page = 1, name = "", classId = "") => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/student?page=${page}&limit=10&name=${encodeURIComponent(
                    name
                )}&classId=${encodeURIComponent(classId)}`
            );
            setStudents(response.data.getstudentdata || []);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
        } catch (error) {
            toast.error("Failed to fetch students.");
        }
        setLoading(false);
    };

    // Fetch class list for class filter dropdown
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

    // Open student details modal and fetch details
    const handleViewDetails = async (studentId) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setModalError(null);
        setSelectedStudent(null); // Clear previous student data

        try {
            // Fetch student details from backend
            const response = await axiosInstance.get(`/student/details/${studentId}`);
            // Adjust this based on your actual API response structure
            const studentData = response.data.student || response.data.data || response.data;

            if (!studentData) {
                throw new Error("Student data not found in response.");
            }
            // Map API response to props expected by StudentDetailsModal
            setSelectedStudent({
                ...studentData, // Keep all original data
                id: studentData.int_idNumber,
                name: studentData.str_name,
                gender: studentData.str_gender,
                fatherName: studentData.objectId_parentId?.str_fatherName || 'N/A',
                motherName: studentData.objectId_parentId?.str_motherName || 'N/A',
                dateOfBirth: studentData.str_dateOfBirth ? new Date(studentData.str_dateOfBirth).toLocaleDateString() : 'N/A',
                religion: studentData.str_religion || 'N/A',
                fatherOccupation: studentData.objectId_parentId?.str_fatherOccupation || 'N/A',
                email: studentData.objectId_parentId?.str_email || 'N/A',
                admissionDate: studentData.date_admissionDate ? new Date(studentData.date_admissionDate).toLocaleDateString() : 'N/A',
                class: studentData.objectId_classId?.int_grade ? `Grade ${studentData.objectId_classId.int_grade} ${studentData.objectId_classId.name ? `- ${studentData.objectId_classId.name}` : ''}` : 'N/A',
                str_studentPhoto: studentData.str_studentPhoto // Make sure this is passed through
            });
        } catch (error) {
            console.error("Failed to fetch student details:", error);
            setModalError(new Error("Failed to load student details."));
            toast.error("Failed to load student details.");
        } finally {
            setModalLoading(false);
        }
    };

    // Close student details modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setModalError(null);
    };

    // Open edit student modal
    const handleEditClick = (e, studentId) => {
        e.stopPropagation(); // Prevent row click event
        setEditStudentId(studentId);
        setIsEditModalOpen(true);
    };

    // Close edit student modal and refresh list if updated
    const handleEditModalClose = (wasUpdated) => {
        setIsEditModalOpen(false);
        setEditStudentId(null);
        if (wasUpdated) {
            // Refresh the students list
            fetchStudents(currentPage, search, selectedClassId);
        }
    };

    // Fetch classes on mount
    useEffect(() => {
        fetchClasses();
    }, []);

    // Fetch students when filters or page changes
    useEffect(() => {
        fetchStudents(currentPage, search, selectedClassId);
    }, [currentPage, search, selectedClassId]);

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchStudents(1, search, selectedClassId);
    };

    // Handle class filter change
    const handleClassChange = (e) => {
        setSelectedClassId(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            {/* Toast notifications */}
            <ToastContainer />
            <div className='admin-dashboard'>
                <Headerbar />
                <div className='main-header'>
                    <h1>Students</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>All Students</p>
                    </div>
                    <div className="Students-layout">
                        <div className="Students-table-section">
                            <h3 className="Students-heading">All Students Data</h3>
                            {/* Search form */}
                            <form className="Students-search-form" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="Students-search-input"
                                    placeholder="Search by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                    className="Students-class-dropdown"
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

                                <button type="submit" className="Students-search-button" disabled={classes.length === 0}>
                                    Search
                                </button>
                            </form>
                            {/* Table or loading indicator */}
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "2rem" }}>
                                    <Loader />
                                </div>
                            ) : (
                                <>
                                    <table className="Students-table">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Name</th>
                                                <th>Gender</th>
                                                <th>Class</th>
                                                <th>Parents</th>
                                                <th>Address</th>
                                                <th>Date of Birth</th>
                                                <th>Phone</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Students.length > 0 ? (
                                                Students.map((student, index) => (
                                                    <tr
                                                        key={student._id || index}
                                                        onClick={(e) => {
                                                            // Only trigger view details if not clicking an action button
                                                            if (!e.target.closest('.action-buttons')) {
                                                                handleViewDetails(student._id);
                                                            }
                                                        }}
                                                    >
                                                        <td>{student.int_idNumber}</td>
                                                        <td>{student.str_name}</td>
                                                        <td>{student.str_gender}</td>
                                                        <td>
                                                            {student.objectId_classId?.int_grade
                                                                ? `Grade ${student.objectId_classId.int_grade}`
                                                                : "N/A"}
                                                        </td>
                                                        <td>
                                                            {student.objectId_parentId
                                                                ? `${student.objectId_parentId.str_fatherName}`
                                                                : "N/A"}
                                                        </td>
                                                        <td>{student.objectId_parentId?.str_address || "N/A"}</td>
                                                        <td>
                                                            {student.str_dateOfBirth
                                                                ? new Date(student.str_dateOfBirth).toLocaleDateString()
                                                                : "N/A"}
                                                        </td>
                                                        <td>{student.objectId_parentId?.str_phoneNumber || "N/A"}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                {/* View student details */}
                                                                <i
                                                                    className="fa-solid fa-eye"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewDetails(student._id);
                                                                    }}
                                                                    title="View Details"
                                                                ></i>
                                                                {/* Edit student */}
                                                                <i
                                                                    className="fa-solid fa-pen-to-square"
                                                                    onClick={(e) => handleEditClick(e, student._id)}
                                                                    title="Edit Student"
                                                                ></i>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} style={{ textAlign: "center" }}>
                                                        No Students found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {/* Pagination controls */}
                                    <div className="expense-pagination">
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
            </div>
            {/* Student details modal */}
            <StudentDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                studentData={selectedStudent}
                isLoading={modalLoading}
                error={modalError}
            />
            {/* Edit student modal */}
            <EditStudentModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                studentId={editStudentId}
            />
        </>
    );
};

export default AllStudent;