import Footer from "../../components/footer"
import Headerbar from "../../components/header"
import React, { useEffect, useState } from "react"
import './subject.css';
import { axiosInstance } from "../../lib/axios";
import FormField from "../../components/from";
import Fromselect from "../../components/select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initial state for add subject form
const initialState = {
    subjectName: "",
    teacher: "",
    classes: "",
    days: ""
};

// Subject component for listing, searching, and adding subjects
const Subject = () => {
    // State for subjects, classes, teachers, pagination, search, form, and loading
    const [Subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    // Fetch subjects from backend with filters and pagination
    const fetchSubjects = async (page = 1, name = "", classId = "") => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/subject?page=${page}&limit=10&name=${encodeURIComponent(
                    name
                )}&classId=${encodeURIComponent(classId)}`
            );
            setSubjects(response.data.getsubjectdata || []);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
            if (!response.data.getsubjectdata || response.data.getsubjectdata.length === 0) {
                toast.error("No subjects found.");
            }
        } catch (error) {
            toast.error("Failed to fetch subjects.");
        }
        setLoading(false);
    };

    // Fetch class list for class filter dropdown and add form
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
            toast.error("Failed to fetch classes.");
        }
        setLoading(false);
    };

    // Fetch teacher list for add form
    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/teacher/master");
            setTeachers(response.data.teacher || []);
        } catch (error) {
            setTeachers([]);
            toast.error("Failed to fetch teachers.");
        }
        setLoading(false);
    };

    // Fetch classes and teachers on mount
    useEffect(() => {
        fetchClasses();
        fetchTeachers();
    }, []);

    // Fetch subjects when filters or page changes
    useEffect(() => {
        fetchSubjects(currentPage, search, selectedClassId);
    }, [currentPage, search, selectedClassId]);

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchSubjects(1, search, selectedClassId);
    };

    // Handle class filter change
    const handleClassChange = (e) => {
        setSelectedClassId(e.target.value);
        setCurrentPage(1);
    };

    // Handle input changes for add subject form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Reset add subject form
    const handleReset = () => {
        setForm(initialState);
    };

    // Handle form submission to add subject
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                subjectName: form.subjectName,
                teacherId: form.teacher,
                classes: [form.classes],
                days: form.days
            };
            await axiosInstance.post('/subject/create', payload);
            toast.success("Subject saved successfully!");
            handleReset();
            fetchSubjects(currentPage, search, selectedClassId);
        } catch (error) {
            toast.error("Failed to save subject. Please try again.");
        }
        setLoading(false);
    };

    return (
        <>
            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className='admin-dashboard'>
                <Headerbar />
                <div className='main-header'>
                    <h1>Subjects</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>Subjects</p>
                    </div>
                    <div className="Subjects-layout">
                        <div className="Subjects-table-section">
                            <h3 className="Subjects-heading">
                                All Subjects
                            </h3>
                            {/* Search form */}
                            <form className="Subjects-search-form" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="Subjects-search-input"
                                    placeholder="Search by subject name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                    className="Subjects-search-select"
                                    value={selectedClassId}
                                    onChange={handleClassChange}
                                    disabled={classes.length === 0}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.int_grade} {cls.name ? `- ${cls.name}` : ""}
                                        </option>
                                    ))}
                                </select>

                                <button type="submit" className="Subjects-search-button" disabled={classes.length === 0}>
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
                                    <table className="Subjects-table">
                                        <thead>
                                            <tr>
                                                <th>Subject Name</th>
                                                <th>Teacher</th>
                                                <th>Classes</th>
                                                <th>Days</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Subjects.length > 0 ? (
                                                Subjects.map((subject, index) => (
                                                    <tr key={subject._id || index}>
                                                        <td>{subject.str_subjectName}</td>
                                                        <td>{subject.objectId_teacherId ? subject.objectId_teacherId.str_firstName : "N/A"}</td>
                                                        <td>
                                                            {subject.arr_classes && subject.arr_classes.length > 0
                                                                ? subject.arr_classes.map((cls, idx) => (
                                                                    <span key={idx}>
                                                                        {cls.int_grade}
                                                                        {cls.name ? ` - ${cls.name}` : ""}
                                                                        {idx !== subject.arr_classes.length - 1 && ", "}
                                                                    </span>
                                                                ))
                                                                : "N/A"}
                                                        </td>
                                                        <td>
                                                            {subject.str_days}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} style={{ textAlign: "center" }}>
                                                        No subjects found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {/* Pagination controls */}
                                    <div className="pagination-container">
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
                    {/* Add subject form section */}
                    <div className="add-subject-section">
                        <div className="add-subject">
                            <h3>Add New Subject</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="subject-form-grid">
                                    {/* Subject Name */}
                                    <FormField
                                        label="Subject Name *"
                                        name="subjectName"
                                        value={form.subjectName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* Teacher select */}
                                    <Fromselect
                                        label="Teacher"
                                        name="teacher"
                                        value={form.teacher}
                                        onChange={handleChange}
                                        options={teachers.map(teacher => ({
                                            value: teacher._id,
                                            label: `${teacher.str_firstName}`
                                        }))}
                                        required
                                    />
                                    {/* Classes select */}
                                    <Fromselect
                                        label="Classes"
                                        name="classes"
                                        value={form.classes}
                                        onChange={handleChange}
                                        options={classes.map(cls => ({
                                            value: cls._id,
                                            label: `${cls.int_grade}${cls.name ? ` - ${cls.name}` : ""}`
                                        }))}
                                        required
                                        disabled={classes.length === 0}
                                    />
                                    {/* Days input */}
                                    <FormField
                                        label="Days"
                                        name="days"
                                        type="text"
                                        value={form.days}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* Form action buttons */}
                                <div className="form-buttons">
                                    <button type="submit" className="submit-button" disabled={loading || classes.length === 0}>
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button type="button" className="reset-button" onClick={handleReset} disabled={loading}>
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
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Subject