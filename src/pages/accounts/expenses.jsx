import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import "./expense.css";
import { axiosInstance } from "../../lib/axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditExpenseModal from "./EditExpenseModal";
import ViewExpenseModal from "./ViewExpenseModal";

// Expenses page component for listing, searching, viewing, and editing expenses
const Expenses = () => {
    // State for expenses, pagination, search, loading, and modals
    const [expense, setExpense] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [searchExpenseType, setSearchExpenseType] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalStates, setModalStates] = useState({
        viewModal: { isOpen: false, data: null },
        editModal: { isOpen: false, id: null, data: null }
    });
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Fetch expenses from backend with filters and pagination
    const fetchexpense = async (page = 1, name = "", expenseType = "", status = "") => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/expense?page=${page}&limit=10&name=${encodeURIComponent(name)}&expenseType=${encodeURIComponent(expenseType)}&status=${encodeURIComponent(status)}`
            );
            if (response.data && Array.isArray(response.data.expenses)) {
                setExpense(response.data.expenses);
            } else {
                setExpense([]);
                toast.error("No expenses found.");
            }
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
        } catch (error) {
            setExpense([]);
            toast.error("Error fetching expenses.");
        }
        setLoading(false);
    };

    // Fetch expenses when filters or page changes
    useEffect(() => {
        fetchexpense(currentPage, searchName, searchExpenseType, searchStatus);
    }, [currentPage, searchName, searchExpenseType, searchStatus]);

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchexpense(1, searchName, searchExpenseType, searchStatus);
    };

    // Get CSS class for status pill
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "paid":
                return "status-paid";
            case "unpaid":
                return "status-unpaid";
            default:
                return "";
        }
    };

    // Open view modal with selected expense details
    const handleViewDetails = (expenseId) => {
        const expenseData = expense.find(exp => exp._id === expenseId);
        if (expenseData) {
            setSelectedExpense(expenseData);
            setIsViewModalOpen(true);
        } else {
            toast.error("Expense details not found");
        }
    };

    // Open edit modal with selected expense data
    const handleEditClick = (expenseId) => {
        const expenseData = expense.find(exp => exp._id === expenseId);
        setModalStates(prev => ({
            ...prev,
            editModal: {
                isOpen: true,
                id: expenseId,
                data: expenseData // Pass the full expense data
            }
        }));
    };

    return (
        <>
            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className='admin-dashboard'>
                <Headerbar />
                <div className='main-header'>
                    <h1>Account</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>Expenses</p>
                    </div>
                    <div className="main-header">
                        <div className="expense-layout">
                            <div className="expense-table-section">
                                <h3 className="expense-heading">All Expenses</h3>
                                {/* Search form */}
                                <form className="expense-search-form" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        className="expense-search-input"
                                        placeholder="Search by name..."
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="expense-search-input"
                                        placeholder="Search by expense type..."
                                        value={searchExpenseType}
                                        onChange={(e) => setSearchExpenseType(e.target.value)}
                                    />
                                    <select
                                        className="expense-search-select"
                                        value={searchStatus}
                                        onChange={(e) => setSearchStatus(e.target.value)}
                                    >
                                        <option value="">Select Status...</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Unpaid">Unpaid</option>
                                    </select>
                                    <button type="submit" className="expense-search-button">
                                        SEARCH
                                    </button>
                                </form>
                                {/* Expense table or loading indicator */}
                                {loading ? (
                                    <div style={{ textAlign: "center", padding: "2rem" }}>
                                        Loading...
                                    </div>
                                ) : (
                                    <>
                                        <table className="expense-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Expense Type</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Parent Email</th>
                                                    <th>Parent Phone</th>
                                                    <th>Due Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expense.length > 0 ? (
                                                    expense.map((item, index) => (
                                                        <tr key={item._id || index}>
                                                            <td>{item.str_name}</td>
                                                            <td>{item.str_expenseType}</td>
                                                            <td>${parseFloat(item.num_amount).toFixed(2)}</td>
                                                            <td>
                                                                <div className={`status-pill ${getStatusClass(item.str_status)}`}>
                                                                    {item.str_status}
                                                                </div>
                                                            </td>
                                                            <td>{item.str_email}</td>
                                                            <td>{item.str_phone}</td>
                                                            <td>{item.date_dueDate}</td>
                                                            <td>
                                                                <div className="action-buttons">
                                                                    {/* View expense details */}
                                                                    <i
                                                                        className="fa-solid fa-eye"
                                                                        onClick={() => handleViewDetails(item._id)}
                                                                        title="View Details"
                                                                    />
                                                                    {/* Edit expense */}
                                                                    <i
                                                                        className="fa-solid fa-pen-to-square"
                                                                        onClick={() => handleEditClick(item._id)}
                                                                        title="Edit Expense"
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={8} style={{ textAlign: "center" }}>
                                                            No expense found.
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
                                    </>
                                )}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
            {/* View expense modal */}
            <ViewExpenseModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedExpense(null);
                }}
                expenseData={selectedExpense}
            />
            {/* Edit expense modal */}
            <EditExpenseModal
                isOpen={modalStates.editModal.isOpen}
                onClose={(wasUpdated) => {
                    setModalStates(prev => ({
                        ...prev,
                        editModal: { isOpen: false, id: null, data: null }
                    }));
                    // Refetch expenses if update was successful
                    if (wasUpdated) {
                        fetchexpense(currentPage, searchName, searchExpenseType, searchStatus);
                    }
                }}
                expenseId={modalStates.editModal.id}
                expenseData={modalStates.editModal.data} // Pass the data to modal
            />
        </>
    );
};

export default Expenses;