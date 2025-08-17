import Footer from "../../components/footer";
import Headerbar from "../../components/header";
import "./parent.css";
import { axiosInstance } from "../../lib/axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditParentModal from './EditParentModal';
import ParentDetailsModal from "./parentsdetailsmodel";

// Parent component for listing, searching, viewing, and editing parent records
const Parent = () => {
    // State for parent data, classes, pagination, search, loading, and modals
    const [parents, setParents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // State for parent details modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    // State for edit parent modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editParentId, setEditParentId] = useState(null);

    // Fetch parents from backend with filters and pagination
    const fetchParents = async (page = 1, name = "", classId = "") => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/parent?page=${page}&limit=10&name=${encodeURIComponent(
                    name
                )}&classId=${encodeURIComponent(classId)}`
            );
            setParents(response.data.getparentdata || []);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
            if (!response.data.getparentdata || response.data.getparentdata.length === 0) {
                toast.error("No parents found.");
            }
        } catch (error) {
            toast.error("Error fetching parents.");
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

    // Fetch parents when filters or page changes
    useEffect(() => {
        fetchParents(currentPage, search, selectedClassId);
    }, [currentPage, search, selectedClassId]);

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchParents(1, search, selectedClassId);
    };

    // Handle class filter change
    const handleClassChange = (e) => {
        setSelectedClassId(e.target.value);
        setCurrentPage(1);
    };

    // Open parent details modal and fetch details
    const handleViewDetails = async (parentId) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setModalError(null);
        setSelectedParent(null);

        try {
            const response = await axiosInstance.get(`/parent/details/${parentId}`);
            const parentData = response.data.data || response.data;

            if (!parentData) {
                throw new Error("Parent data not found");
            }

            setSelectedParent({
                fatherName: parentData.str_fatherName,
                motherName: parentData.str_motherName,
                fatherOccupation: parentData.str_fatherOccupation,
                address: parentData.str_address,
                email: parentData.str_email,
                phone: parentData.str_phoneNumber,
                children: parentData.arr_children || []
            });
        } catch (error) {
            console.error("Failed to fetch parent details:", error);
            setModalError(new Error("Failed to load parent details."));
            toast.error("Failed to load parent details.");
        } finally {
            setModalLoading(false);
        }
    };

    // Close parent details modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedParent(null);
        setModalError(null);
    };

    // Open edit parent modal
    const handleEditClick = (e, parentId) => {
        e.stopPropagation(); // Prevent row click event
        setEditParentId(parentId);
        setIsEditModalOpen(true);
    };

    // Close edit parent modal and refresh list if updated
    const handleEditModalClose = (wasUpdated) => {
        setIsEditModalOpen(false);
        setEditParentId(null);
        if (wasUpdated) {
            // Refresh the parents list
            fetchParents(currentPage, search, selectedClassId);
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <Headerbar />
            <div className="main-header">
                <h1>Dashboard</h1>
                <div className="reds-line"></div>
                <div className="accounts-expense">
                    <p>Home</p>
                </div>
                <div className="parents-layout">
                    <div className="parents-table-section">
                        <h3 className="parents-heading">All Parents Data</h3>
                        {/* Search form */}
                        <form className="parents-search-form" onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="parents-search-input"
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className="parents-search-select"
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
                            <button type="submit" className="parents-search-button" disabled={classes.length === 0}>
                                Search
                            </button>
                        </form>
                        {/* Table or loading indicator */}
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "2rem" }}>
                                Loading...
                            </div>
                        ) : (
                            <>
                                <div className="table-container">
                                    <table className="parents-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>FatherName</th>
                                                <th>MotherName</th>
                                                <th>Occupation</th>
                                                <th>Address</th>
                                                <th>E-mail</th>
                                                <th>Phone</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parents.length > 0 ? (
                                                parents.map((parent, index) => (
                                                    <tr key={parent._id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{parent.str_fatherName}</td>
                                                        <td>{parent.str_motherName}</td>
                                                        <td>{parent.str_fatherOccupation}</td>
                                                        <td className="text-ellipsis" title={parent.str_address}>
                                                            {parent.str_address}
                                                        </td>
                                                        <td className="text-ellipsis" title={parent.str_email}>
                                                            {parent.str_email}
                                                        </td>
                                                        <td>{parent.str_phoneNumber}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                {/* View parent details */}
                                                                <i 
                                                                    className="fa-solid fa-eye"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewDetails(parent._id);
                                                                    }}
                                                                    title="View Details"
                                                                ></i>
                                                                {/* Edit parent */}
                                                                <i 
                                                                    className="fa-solid fa-pen-to-square"
                                                                    onClick={(e) => handleEditClick(e, parent._id)}
                                                                    title="Edit Parent"
                                                                ></i>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} style={{ textAlign: "center" }}>
                                                        No parents found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
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
            {/* Parent details modal */}
            <ParentDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                parentData={selectedParent}
                isLoading={modalLoading}
                error={modalError}
            />
            {/* Edit parent modal */}
            <EditParentModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                parentId={editParentId}
            />
        </div>
    );
};

export default Parent;
