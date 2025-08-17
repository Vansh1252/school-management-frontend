import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import Fromselect from '../../components/select';
import { axiosInstance } from '../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './studentpromtion.css';
import { useState, useEffect } from 'react';

const initialState = {
    studentId: "",
    fromClassId: "",
    toClassId: "",
};

const StudentPromotion = () => {
    const [form, setForm] = useState(initialState);
    const [classes, setClasses] = useState([]);
    const [students, setstudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/classes/master');
                if (res.data && Array.isArray(res.data.classes) && res.data.classes.length > 0) {
                    setClasses(res.data.classes);
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
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchstudentname = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get('/student/master');
                if (res.data && Array.isArray(res.data.studentname) && res.data.studentname.length > 0) {
                    setstudents(res.data.studentname);
                } else {
                    setstudents([]);
                    toast.error("No students found. Please add students first.");
                }
            } catch (error) {
                setstudents([]);
                toast.error("Failed to fetch students");
            }
            setLoading(false);
        }
        fetchstudentname();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setForm(initialState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/student/promtion', form);
            toast.success("Student promoted successfully!");
            handleReset();
        } catch (error) {
            toast.error("Failed to promote student. Please try again.");
        }
        setLoading(false);
    };

    const classOptions = classes.map(cls => ({
        value: cls._id,
        label: `${cls.int_grade}${cls.name ? ` - ${cls.name}` : ""}`
    }));

    const studentsoptions = students.map(student => ({
        value: student._id,
        label: `${student.str_name}`
    }));

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
                        <p style={{ color: "red" }}>Student Promotion Form</p>
                    </div>
                    <div className='student-promtion'>
                        <h3>Student Promotion</h3>
                        {/* Promotion form */}
                        <form onSubmit={handleSubmit}>
                            <div className='add-promotion-form-grid'>
                                {/* Student select */}
                                <Fromselect
                                    label="Student Name"
                                    name="studentId"
                                    value={form.studentId}
                                    onChange={handleChange}
                                    options={studentsoptions}
                                    required
                                />
                                {/* From class select */}
                                <Fromselect
                                    label="Promotion From Class"
                                    name="fromClassId"
                                    value={form.fromClassId}
                                    onChange={handleChange}
                                    options={classOptions}
                                    required
                                />
                                {/* To class select */}
                                <Fromselect
                                    label="Promotion To Class"
                                    name="toClassId"
                                    value={form.toClassId}
                                    onChange={handleChange}
                                    options={classOptions}
                                    required
                                />
                            </div>
                            <div style={{ marginTop: "1rem" }}>
                                {/* Submit and Reset buttons */}
                                <button className='submit' type="submit" disabled={loading || classes.length === 0}>
                                    {loading ? "Promoting..." : "Promote"}
                                </button>
                                <button className='reset' type="button" onClick={handleReset} style={{ marginLeft: "1rem" }} disabled={loading}>
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
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default StudentPromotion;