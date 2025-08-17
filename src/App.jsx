// App.jsx
import React from "react";
  import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
    useLocation,
  } from "react-router-dom";
import Student from "./pages/students/allStudent";
import AddStudent from "./pages/students/addStudent";
import StudentPromotion from "./pages/students/studentPromtion";
import Teacher from "./pages/teachers/allTeacher";
import AddTeacher from "./pages/teachers/addTeacher";
import Parent from "./pages/parents/parent";
import Account from "./pages/accounts/addExpense";
import Expenses from "./pages/accounts/expenses";
import StudentFees from "./pages/accounts/studentFees";
import FeesGroup from "./pages/accounts/feesGroup";
import Subject from "./pages/subjects/subject";
import Login from "./pages/login";
import Setting from "./pages/settings";
import Dashboard from "./pages/dashboard";
import Sidebar from "./components/sidebar";
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import Forgot_password from "./pages/forgot_password";
import "./App.css";
import ResetPassword from "./pages/resetpassword";
import MyAccount from "./pages/MyAccount";

// ProtectedRoute component to restrict access based on authentication and role
const ProtectedRoute = ({ children }) => {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const location = useLocation();

  // If not logged in, show login page
  if (!user) {
    return <Login />;
  }

  // Role-based redirect only if user is at root "/"
  if (location.pathname === "/") {
    const role = user.userobject?.role;
    if (role === "teacher") {
      return <Navigate to="/students" replace />;
    }
    if (role === "student") {
      return <Navigate to="/subjects" replace />;
    }
    if (role === "parent") {
      return <Navigate to="/subjects" replace />;
    }
    // admin stays on dashboard "/"
  }

  // Render children if authenticated and authorized
  return children;
};

// Layout component with sidebar and outlet for nested routes
const Layout = () => (
  <>
    <Sidebar />
    <Outlet />
  </>
);

// Define application routes using react-router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "students", element: <Student /> },
      { path: "students/add", element: <AddStudent /> },
      { path: "students/promotion", element: <StudentPromotion /> },
      { path: "teachers", element: <Teacher /> },
      { path: "teachers/add", element: <AddTeacher /> },
      { path: "parents", element: <Parent /> },
      { path: "settings", element: <Setting /> },
      { path: "account/add", element: <Account /> },
      { path: "account/expenses", element: <Expenses /> },
      { path: "account/student-fees", element: <StudentFees /> },
      { path: "account/fees-group", element: <FeesGroup /> },
      { path: "subjects", element: <Subject /> },
      { path: "/500", element: <ServerError /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/forgot_password", element: <Forgot_password /> },
  { path: "/reset-password/:id/:token", element: <ResetPassword /> },
  { path: "/my-account", element: <MyAccount /> },
]);

// Main App component providing the router
function App() {
  return <RouterProvider router={router} />;
}

export default App;
