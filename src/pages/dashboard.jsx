import React, { useState, useEffect } from 'react';
import Headerbar from '../components/header';
import Footer from '../components/footer';
import './dashboard.css';
import { axiosInstance } from '../lib/axios';
import Reminders from '../components/Reminders';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventForm from '../components/EventForm';
import Loader from '../components/Loader';

// Register ChartJS components for chart rendering
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Days of the week for calendar
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Dashboard = () => {
    // State for dashboard data, date, events, menus, forms, and loading
    const [dashboardData, setDashboardData] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [eventMenuAnchor, setEventMenuAnchor] = useState(null);
    const [reminderMenuAnchor, setReminderMenuAnchor] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showReminderForm, setShowReminderForm] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state

    // Get year and month for currentDate
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Get total days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create an array representing all days in the calendar grid (including empty days before 1st)
    const calendarDays = [];

    // Fill empty slots for days before 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }

    // Fill days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    // Handlers to go previous/next month
    const goPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Fetch dashboard data on mount
    useEffect(() => {
        setLoading(true); // Start loader
        axiosInstance.get("/dashboard")
            .then((res) => {
                const apiData = res.data.data;

                // Prepare bar chart data
                const barLabels = apiData.expensesLast3Months.map(
                    (item) => `${item._id.month}/${item._id.year}`
                );
                const barData = apiData.expensesLast3Months.map((item) => item.total);

                // Prepare doughnut chart data
                const doughnutLabels = ["Male", "Female"];
                const doughnutData = [
                    apiData.maleFemaleCount.male,
                    apiData.maleFemaleCount.female,
                ];

                // Mock line chart data
                const lineLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                const feesSubmissions = [0, 25000, 50000, 55000, 61000, 71000];
                const totalCollection = [0, 25000, 60000, 47000, 51100, 71300];

                setDashboardData({
                    barLabels,
                    barData,
                    doughnutLabels,
                    doughnutData,
                    lineLabels,
                    feesSubmissions,
                    totalCollection,
                    totalStudents: apiData.totalStudents,
                    totalTeachers: apiData.totalTeachers,
                    totalParents: apiData.totalParents,
                    totalEarnings: apiData.totalFeesCollected || 200000, // fallback
                    upcomingEvents: apiData.upcomingEvents || [],
                    upcomingReminders: apiData.upcomingReminders || [],
                });

                setEvents(apiData.upcomingEvents || []);
            })
            .catch((err) => {
                toast.error("Failed to fetch dashboard data");
                console.error("Failed to fetch dashboard data", err);
            })
            .finally(() => setLoading(false)); // End loader
    }, []);

    // Event menu handlers
    const handleEventMenuClick = (event) => setEventMenuAnchor(event.currentTarget);
    const handleReminderMenuClick = (event) => setReminderMenuAnchor(event.currentTarget);
    const handleEventMenuClose = () => setEventMenuAnchor(null);
    const handleReminderMenuClose = () => setReminderMenuAnchor(null);

    // Handle adding a new event
    const handleAddEvent = async (eventData) => {
        try {
            const response = await axiosInstance.post('/event/create', eventData);
            setEvents(prev => [...prev, response.data]);
            toast.success('Event added successfully');
        } catch (error) {
            toast.error('Failed to add event');
            console.error('Event creation error:', error);
        }
    };

    // Handle adding a new reminder (just opens the form)
    const handleAddReminder = () => setShowReminderForm(true);

    // Show loader while loading
    if (loading) {
        return (
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff"
            }}>
                <Loader />
            </div>
        );
    }

    // Show message if no dashboard data available
    if (!dashboardData) return <p style={{ textAlign: "center" }}>No dashboard data available.</p>;

    return (
        <div className='admin-dashboard'>
            <Headerbar />
            <div className='main-header'>
                <h1>Dashboard</h1>
                <div className="reds-line"></div>
                <div className="accounts-expense">
                    <p>Home</p>
                </div>
                {/* Dashboard summary cards */}
                <div className='cards'>
                    <div className='card'>
                        <div className='img-logo'>
                            <img src="src/assets/Group 2.svg" alt="" />
                        </div>
                        <div className="reds-lines"></div>
                        <div className="card-information">
                            <h2>Students</h2>
                            <h2>{dashboardData.totalStudents}</h2>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='img-logo'>
                            <img src="src/assets/Group 3.svg" alt="" />
                        </div>
                        <div className="reds-lines"></div>
                        <div className="card-information">
                            <h2>Teachers</h2>
                            <h2>{dashboardData.totalTeachers}</h2>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='img-logo'>
                            <img src="src/assets/Group 4.svg" alt="" />
                        </div>
                        <div className="reds-lines"></div>
                        <div className="card-information">
                            <h2>Parents</h2>
                            <h2>{dashboardData.totalParents}</h2>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='img-logo'>
                            <img src="src/assets/Group 5.svg" alt="" />
                        </div>
                        <div className="reds-lines"></div>
                        <div className="card-information">
                            <h2>Earnings</h2>
                            <h2>${dashboardData.totalEarnings}</h2>
                        </div>
                    </div>
                </div>
                {/* Graph cards for earnings, expenses, and students */}
                <div className="graph-cards">
                    {/* Earnings Card */}
                    <div className="Earnings-card">
                        <div className="Earnings-header">
                            <h2>Earnings</h2>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="..." fill="currentColor" />
                            </svg>
                        </div>
                        <div className="collection">
                            <div className="Total-Collection">
                                <div className="Total">
                                    <div className="blue dot"></div>
                                    <p>Total Collections</p>
                                </div>
                                <p>$ 90,000</p>
                            </div>
                            <div className="fees-Collection">
                                <div className="Total">
                                    <div className="red dot"></div>
                                    <p>Fees Collections</p>
                                </div>
                                <p>$ 75,000</p>
                            </div>
                            <div className="dates">
                                <p>June 10, 2021</p>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="..." fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                        {/* Line chart for earnings */}
                        <Line
                            data={{
                                labels: dashboardData.lineLabels,
                                datasets: [
                                    {
                                        label: "Fees Submissions",
                                        data: dashboardData.feesSubmissions,
                                        borderColor: "red",
                                        fill: false,
                                    },
                                    {
                                        label: "Total Collection",
                                        data: dashboardData.totalCollection,
                                        borderColor: "blue",
                                        fill: false,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true }
                                }
                            }}
                        />
                    </div>

                    {/* Expenses Card */}
                    <div className="expenses-card">
                        <div className="expenses-header">
                            <h2>Expenses</h2>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="..." fill="currentColor" />
                            </svg>
                        </div>
                        <div className="months-expense">
                            {dashboardData.barLabels.map((label, i) => (
                                <div className="expense" key={i}>
                                    <h3>{label}</h3>
                                    <p>$ {dashboardData.barData[i]}</p>
                                    <div className={`line ${["green", "blue", "red"][i % 3]}`}></div>
                                </div>
                            ))}
                        </div>
                        {/* Bar chart for expenses */}
                        <Bar
                            data={{
                                labels: dashboardData.barLabels,
                                datasets: [
                                    {
                                        backgroundColor: ["green", "blue", "red"],
                                        data: dashboardData.barData,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: false },
                                    title: { display: true, text: "Expenses Overview" }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Student Card */}
                    <div className="student-card">
                        <div className="student-header">
                            <h2>Students</h2>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="..." fill="currentColor" />
                            </svg>
                        </div>
                        {/* Doughnut chart for male/female students */}
                        <Doughnut
                            data={{
                                labels: dashboardData.doughnutLabels,
                                datasets: [
                                    {
                                        backgroundColor: ["red", "blue"],
                                        data: dashboardData.doughnutData,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Male vs Female Students"
                                    }
                                }
                            }}
                        />

                        <div className="student-information">
                            <div className="male-information">
                                <div className="lines blueline "></div>
                                <h4>Male</h4>
                                <p>{dashboardData.doughnutData[0]}</p>
                            </div>
                            <div className="big-line"></div>
                            <div className="female-information">
                                <div className="lines red"></div>
                                <h4>Female</h4>
                                <p>{dashboardData.doughnutData[1]}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Event calendar and reminders section */}
                <div className='event-reminders'>
                    <div className='Calendar'>
                        <div className='calendar-header'>
                            <h2>Event Calendar</h2>
                            <IconButton onClick={handleEventMenuClick}>
                                <MoreVertIcon />
                            </IconButton>
                        </div>
                        {/* Calendar grid */}
                        <div style={{ width: 700, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <button onClick={goPrevMonth}>&lt;</button>
                                <h3>{currentDate.toLocaleString('default', { month: 'long' })} {year}</h3>
                                <button onClick={goNextMonth}>&gt;</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, textAlign: 'center' }}>
                                {daysOfWeek.map(day => (
                                    <div key={day} style={{ fontWeight: 'bold' }}>{day}</div>
                                ))}
                                {calendarDays.map((day, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: 10,
                                            backgroundColor: day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? '#3f51b5' : '#f0f0f0',
                                            color: day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? 'white' : 'black',
                                            borderRadius: 4,
                                        }}
                                    >
                                        {day || ''}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* List of events */}
                        <div className="events-list">
                            {events.map((event, index) => (
                                <div key={event._id || index} className="event-item">
                                    <h4>{new Date(event.date_date).toLocaleDateString()}</h4>
                                    <p className="event-title">{event.str_title}</p>
                                    <p className="event-description">{event.str_description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Reminders component */}
                    <Reminders
                        reminders={dashboardData.upcomingReminders || []}
                        onAddReminder={handleAddReminder}
                    />
                    {/* Menus and Forms for adding events/reminders */}
                    <Menu
                        anchorEl={eventMenuAnchor}
                        open={Boolean(eventMenuAnchor)}
                        onClose={handleEventMenuClose}
                    >
                        <MenuItem onClick={() => {
                            handleEventMenuClose();
                            setShowEventForm(true);
                        }}>
                            Add New Event
                        </MenuItem>
                    </Menu>
                    <Menu
                        anchorEl={reminderMenuAnchor}
                        open={Boolean(reminderMenuAnchor)}
                        onClose={handleReminderMenuClose}
                    >
                        <MenuItem onClick={() => {
                            handleReminderMenuClose();
                            setShowReminderForm(true);
                        }}>
                            Add New Reminder
                        </MenuItem>
                    </Menu>
                    {/* Event and Reminder forms */}
                    <EventForm
                        open={showEventForm}
                        onClose={() => setShowEventForm(false)}
                        onSubmit={handleAddEvent}
                        type="event"
                    />
                    <EventForm
                        open={showReminderForm}
                        onClose={() => setShowReminderForm(false)}
                        onSubmit={handleAddReminder}
                        type="reminder"
                    />
                    <ToastContainer />
                </div>
                <Footer />
            </div>
        </div >
    );
};

export default Dashboard;
