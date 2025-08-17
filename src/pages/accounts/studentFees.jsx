import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import "./studentFees.css";
import { axiosInstance } from "../../lib/axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewStudentFeesModal from './ViewStudentFeesModal';
import EditStudentFeesModal from './EditStudentFeesModal';

// Studentfees component for listing, searching, viewing, and editing student fees
const Studentfees = () => {
    // State for student fees, classes, pagination, search, loading, and modals
    const [studentFees, setStudentFees] = useState([]);
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [searchClassId, setSearchClassId] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [modalStates, setModalStates] = useState({
        view: false,
        edit: false
    });

    // Fetch student fees from backend with filters and pagination
    const fetchStudentFees = async (page = 1, name = "", classId = "", status = "") => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/student?page=${page}&limit=10&name=${encodeURIComponent(name)}&classId=${encodeURIComponent(classId)}&status=${encodeURIComponent(status)}`
            );

            if (response.data && Array.isArray(response.data.getstudentdata) && response.data.getstudentdata.length > 0) {
                setStudentFees(response.data.getstudentdata);
            } else {
                setStudentFees([]);
                toast.error("No student fees found.");
            }
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
        } catch (error) {
            setStudentFees([]);
            toast.error("Error fetching student fees.");
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
            toast.error("Error fetching classes.");
        }
        setLoading(false);
    };

    // Fetch classes on mount
    useEffect(() => {
        fetchClasses();
    }, []);

    // Fetch student fees when filters or page changes
    useEffect(() => {
        fetchStudentFees(currentPage, searchName, searchClassId, searchStatus);
    }, [currentPage, searchName, searchClassId, searchStatus]);

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchStudentFees(1, searchName, searchClassId, searchStatus);
    };

    // Get CSS class for status pill
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "status-paid";
            case "unpaid":
                return "status-unpaid";
            default:
                return "";
        }
    };

    // Open view modal with selected fee details
    const handleViewDetails = (feeItem) => {
        setSelectedFee(feeItem);
        setModalStates(prev => ({ ...prev, view: true }));
    };

    // Open edit modal with selected fee data
    const handleEditClick = (feeItem) => {
        setSelectedFee(feeItem);
        setModalStates(prev => ({ ...prev, edit: true }));
    };

    return (
        <>
            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className='admin-dashboard'>
                <Headerbar />
                <div className="main-header">
                    <h1>Account</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>Student Fees</p>
                    </div>
                    <div className="studentFees-layout">
                        <div className="studentFees-table-section">
                            <h3 className="studentFees-heading">All Student Fees Data</h3>
                            {/* Search form */}
                            <form className="studentFees-search-form" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="studentFees-search-input"
                                    placeholder="Search by name..."
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                                <select
                                    className="studentFees-search-select"
                                    value={searchClassId}
                                    onChange={(e) => setSearchClassId(e.target.value)}
                                    disabled={classes.length === 0}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.int_grade} {cls.name ? `- ${cls.name}` : ""}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="studentFees-search-select"
                                    value={searchStatus}
                                    onChange={(e) => setSearchStatus(e.target.value)}
                                >
                                    <option value="">Select Status...</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                                <button type="submit" className="studentFees-search-button" disabled={classes.length === 0}>
                                    SEARCH
                                </button>
                            </form>
                            {/* Table or loading indicator */}
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "2rem" }}>
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    <table className="studentFees-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Gender</th>
                                                <th>Class</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Parent Email</th>
                                                <th>Parent Phone</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentFees.length > 0 ? (
                                                studentFees.map((feeItem, index) => (
                                                    <tr key={feeItem._id || index}>
                                                        <td>{feeItem.int_idNumber}</td>
                                                        <td>{feeItem.str_name}</td>
                                                        <td>{feeItem.str_gender}</td>
                                                        <td>
                                                            {feeItem.objectId_classId?.int_grade
                                                                ? `Grade ${feeItem.objectId_classId.int_grade}`
                                                                : "N/A"}
                                                        </td>
                                                        <td>
                                                            {feeItem.int_totalFees}
                                                        </td>
                                                        <td>
                                                            <div className={`status-pill ${getStatusClass(feeItem.str_feesStatus)}`}>
                                                                {feeItem.str_feesStatus}
                                                            </div>
                                                        </td>
                                                        <td>{feeItem.objectId_parentId?.str_email}</td>
                                                        <td>{feeItem.objectId_parentId?.str_phoneNumber}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                {/* View student fees details */}
                                                                <i
                                                                    className="fa-solid fa-eye"
                                                                    onClick={() => handleViewDetails(feeItem)}
                                                                    title="View Details"
                                                                />
                                                                {/* Edit student fees */}
                                                                <i
                                                                    className="fa-solid fa-pen-to-square"
                                                                    onClick={() => handleEditClick(feeItem)}
                                                                    title="Edit Fees"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={9} style={{ textAlign: "center" }}>
                                                        No student fees found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {/* Pagination controls */}
                                    <div className="studentFees-pagination">
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
            {/* View student fees modal */}
            <ViewStudentFeesModal
                isOpen={modalStates.view}
                onClose={() => {
                    setModalStates(prev => ({ ...prev, view: false }));
                    setSelectedFee(null);
                }}
                feeData={selectedFee}
            />

            {/* Edit student fees modal */}
            <EditStudentFeesModal
                isOpen={modalStates.edit}
                onClose={(wasUpdated) => {
                    setModalStates(prev => ({ ...prev, edit: false }));
                    setSelectedFee(null);
                    // Refetch student fees if update was successful
                    if (wasUpdated) {
                        fetchStudentFees(currentPage, searchName, searchClassId, searchStatus);
                    }
                }}
                feeData={selectedFee}
            />
        </>
    )
}
export default Studentfees;