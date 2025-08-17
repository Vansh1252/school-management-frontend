import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../lib/axios";
import './feesgroup.css';

// Feesgroup component for managing fees groups (list, add, pagination)
const Feesgroup = () => {
    // State for fees groups, pagination, search, modal, classes, loading
    const [feesgroups, setFeesgroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Initial form state for adding a fees group
    const initialForm = {
        classId: "",
        description: "",
        feeTypes: [{ str_feeName: "", int_amount: "" }]
    };
    const [formData, setFormData] = useState(initialForm);

    // Fetch classes for the class dropdown
    const getClasses = async () => {
        setFetching(true);
        try {
            const res = await axiosInstance.get("/classes/master");
            setClasses(Array.isArray(res.data.classes) ? res.data.classes : []);
        } catch (error) {
            setClasses([]);
            toast.error("Failed to load classes.");
        }
        setFetching(false);
    };

    // Fetch fees groups for the table
    const getFeesgroups = async () => {
        setFetching(true);
        try {
            const res = await axiosInstance.get("/feesgroup", {
                params: { page: currentPage, name: search }
            });
            const apiData = res.data.data || {};
            setFeesgroups(Array.isArray(apiData.feesgroups) ? apiData.feesgroups : []);
            setTotalPages(apiData.totalPages || 1);
        } catch (error) {
            setFeesgroups([]);
            toast.error("Failed to load fees groups.");
        }
        setFetching(false);
    };

    // Fetch classes and fees groups on mount and when page changes
    useEffect(() => {
        getClasses();
        getFeesgroups();
        // eslint-disable-next-line
    }, [currentPage]);

    // Handle form input changes for modal (including fee types)
    const handleFormChange = (e, idx) => {
        const { name, value } = e.target;
        if (name.startsWith("feeType")) {
            // Update a specific fee type in the array
            const feeTypes = [...formData.feeTypes];
            const field = name.split("-")[1]; // "str_feeName" or "int_amount"
            feeTypes[idx][field] = value;
            setFormData({ ...formData, feeTypes });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Add a new fee type input row
    const addFeeType = () => {
        setFormData(prev => ({
            ...prev,
            feeTypes: [...prev.feeTypes, { str_feeName: "", int_amount: "" }]
        }));
    };

    // Remove a fee type input row
    const removeFeeType = (idx) => {
        setFormData(prev => ({
            ...prev,
            feeTypes: prev.feeTypes.filter((_, i) => i !== idx)
        }));
    };

    // Handle modal form submit to add a new fees group
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/feesgroup/create", formData);
            setShowModal(false);
            setFormData(initialForm);
            getFeesgroups();
            toast.success("Fees group added!");
        } catch (error) {
            toast.error("Failed to add fees group.");
        }
        setLoading(false);
    };

    // Open modal and reset form
    const handleOpenModal = () => {
        setFormData(initialForm);
        setShowModal(true);
    };

    return (
        <>
            <div className='admin-dashboard'>
                <Headerbar />
                <div className="main-header">
                    <h1>Account</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>Fees Group</p>
                    </div>
                    <div className="fees-group-container">
                        <ToastContainer />
                        <div className="header">
                            <h3>Fees Group List</h3>
                            <button className='btn' onClick={handleOpenModal} disabled={loading || fetching}>Add Fees Group</button>
                        </div>

                        {/* Search input */}
                        <input
                            type="text"
                            className="search-box"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            disabled={fetching}
                        />
                        {/* Table or loading indicator */}
                        {fetching ? (
                            <div style={{ margin: "2rem", color: "#d60a0b", textAlign: "center" }}>Loading...</div>
                        ) : (
                            <table className="fees-table">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Class</th>
                                        <th>Fees Type</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feesgroups.length > 0 ? feesgroups.map((group, idx) => (
                                        <tr key={group._id}>
                                            <td>{(currentPage - 1) * 10 + idx + 1}</td>
                                            <td>
                                                {typeof group.objectId_classId === "object"
                                                    ? group.objectId_classId.str_className || group.objectId_classId.int_grade || group.objectId_classId.name || ""
                                                    : group.objectId_classId || ""}
                                            </td>
                                            <td>
                                                {Array.isArray(group.arr_feeTypes)
                                                    ? group.arr_feeTypes.map((f, i) => (
                                                        <div key={i}>{f.str_feeName || f.str_feeName} - {f.int_amount}</div>
                                                    ))
                                                    : ""}
                                            </td>
                                            <td>{group.str_description || group.description}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: "center" }}>No fees groups found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* Pagination */}
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                    disabled={fetching}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Modal for adding fees group */}
                        {showModal && (
                            <div className="modal">
                                <div className="modal-content-1">
                                    <h3>Add Fees Group</h3>
                                    <form onSubmit={handleSubmit}>
                                        {/* Class select */}
                                        <label>
                                            Class *
                                            <select
                                                name="classId"
                                                value={formData.classId}
                                                onChange={handleFormChange}
                                                required
                                                disabled={loading || fetching}
                                            >
                                                <option value="">Select Class</option>
                                                {Array.isArray(classes) && classes.map(cls => (
                                                    <option key={cls._id} value={cls._id}>
                                                        {cls.str_className || cls.int_grade || cls.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        {/* Description textarea */}
                                        <label>
                                            Description
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleFormChange}
                                                disabled={loading}
                                            />
                                        </label>
                                        {/* Fee types input list */}
                                        <label>Fee Types</label>
                                        {formData.feeTypes.map((fee, idx) => (
                                            <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                                <input
                                                    type="text"
                                                    name="feeType-str_feeName"
                                                    placeholder="Fee Name"
                                                    value={fee.str_feeName}
                                                    onChange={e => handleFormChange(e, idx)}
                                                    required
                                                    disabled={loading}
                                                />
                                                <input
                                                    type="number"
                                                    name="feeType-int_amount"
                                                    placeholder="Amount"
                                                    value={fee.int_amount}
                                                    onChange={e => handleFormChange({ target: { name: "feeType-int_amount", value: e.target.value } }, idx)}
                                                    required
                                                    disabled={loading}
                                                />
                                                {/* Remove fee type button */}
                                                {formData.feeTypes.length > 1 && (
                                                    <button type="button" className="btn cancel" onClick={() => removeFeeType(idx)} disabled={loading}>
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {/* Add fee type button */}
                                        <button type="button" className="btn" onClick={addFeeType} disabled={loading}>
                                            Add Fee Type
                                        </button>
                                        <div style={{ marginTop: "1rem" }}>
                                            {/* Save and Cancel buttons */}
                                            <button type="submit" className="btn" disabled={loading}>
                                                {loading ? "Saving..." : "Save"}
                                            </button>
                                            <button type="button" className="btn cancel" onClick={() => setShowModal(false)} disabled={loading}>
                                                Cancel
                                            </button>
                                        </div>
                                        {/* Loader for modal */}
                                        {loading && (
                                            <div style={{ marginTop: "1rem", color: "#d60a0b" }}>
                                                Loading...
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}
export default Feesgroup