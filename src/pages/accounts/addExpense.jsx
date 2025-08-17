import React, { useState } from 'react';
import Footer from '../../components/footer';
import Headerbar from '../../components/header';
import FormField from '../../components/from';
import Fromselect from '../../components/select';
import { axiosInstance } from '../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../../components/Loader'; // Loader for showing loading state
import 'react-toastify/dist/ReactToastify.css';
import './addExpense.css';

// Initial state for the expense form
const initialState = {
    name: "",
    expenseType: "",
    status: "",
    amount: "",
    phone: "",
    email: "",
    dueDate: "",
};

const Addexpense = () => {
    // State for form data and loading
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    // Options for expense type and status dropdowns
    const expenseTypes = [
        { value: "Personal", label: "Personal" },
        { value: "Business", label: "Business" },
        { value: "Travel", label: "Travel" }
    ];
    const statuses = [
        { value: "Unpaid", label: "Unpaid" },
        { value: "Paid", label: "Paid" }
    ];

    // Handle input changes for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Reset form to initial state
    const handleReset = () => {
        setForm(initialState);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader
        try {
            await axiosInstance.post('/expense/create', form);
            toast.success("Expense saved successfully!");
            handleReset();
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to save expense. Please try again."
            );
        }
        setLoading(false); // Hide loader
    };

    return (
        <div className='admin-dashboard'>
            <Headerbar />
            <div className='main-bar'>
                <div className='main-header'>
                    <h1>Account</h1>
                    <div className="reds-line"></div>
                    <div className='accounts-expense'>
                        <p>Home</p>
                        <i className="fa fa-caret-right" style={{ color: "red" }}></i>
                        <p style={{ color: "red" }}>Add Expense</p>
                    </div>
                    <div className='add-expense'>
                        <h2>Add New Expenses</h2>
                        {/* Expense form */}
                        <form onSubmit={handleSubmit}>
                            <div className='add-expense-form-grid'>
                                {/* Name field */}
                                <FormField
                                    label="Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                                {/* Expense Type dropdown */}
                                <Fromselect
                                    label="Expense Type"
                                    name="expenseType"
                                    value={form.expenseType}
                                    onChange={handleChange}
                                    options={expenseTypes}
                                    required
                                />
                                {/* Status dropdown */}
                                <Fromselect
                                    label="Status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    options={statuses}
                                    required
                                />
                                {/* Amount field */}
                                <FormField
                                    label="Amount"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                />
                                {/* Phone field */}
                                <FormField
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                                {/* Email field */}
                                <FormField
                                    label="E-mail"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                {/* Due Date field */}
                                <FormField
                                    label="Due Date"
                                    name="dueDate"
                                    type="date"
                                    value={form.dueDate}
                                    onChange={handleChange}
                                    required
                                />
                                <div></div>
                            </div>
                            {/* Form action buttons */}
                            <div style={{ marginTop: "1rem" }}>
                                <button className='submit' type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button className='reset' type="button" onClick={handleReset} style={{ marginLeft: "1rem" }} disabled={loading}>
                                    Reset
                                </button>
                            </div>
                            {/* Loader shown during form submission */}
                            {loading && (
                                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                    <Loader />
                                </div>
                            )}
                        </form>
                    </div>
                    <Footer />
                </div>
            </div>
            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default Addexpense;