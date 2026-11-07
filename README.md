<h1 align="center">School Management System – Frontend</h1>

<p align="center">
  React admin dashboard for running a school: students, teachers, parents, subjects, fees, expenses, events and reminders, all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white"/>
  <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white"/>
</p>

> Backend API: [school-mangement-backend-](https://github.com/Vansh1252/school-mangement-backend-)

---

## Features

- **Auth:** login, forgot password and reset password pages, with cookie-based sessions via Axios
- **Dashboard:** charts (Chart.js), a calendar and a reminders widget
- **Students:** list, add, edit and view details
- **Teachers and parents:** full management with edit and detail modals
- **Subjects:** subject management
- **Accounts:** fee groups, student fees and expenses, with add, edit and view modals
- **Events and reminders:** an event form and a reminders list
- **My account and settings** pages
- **Error handling:** 404, 500 and generic error pages

## Tech stack

| Area | Tools |
|---|---|
| Framework | React + Vite |
| Routing | React Router |
| UI | Material UI, Ant Design, Font Awesome, Lucide, React Icons |
| Charts | Chart.js with react-chartjs-2 |
| Calendar | react-calendar |
| HTTP | Axios (with credentials) |
| Notifications | react-hot-toast, react-toastify |

## Project structure

~~~text
src/
├── App.jsx            # Routes
├── main.jsx           # Entry point
├── components/        # Header, sidebar, footer, loader, event form, reminders
├── lib/axios.js       # API client
└── pages/
    ├── dashboard/
    ├── students/
    ├── teachers/
    ├── parents/
    ├── subjects/
    ├── accounts/      # Fees, fee groups, expenses
    ├── settings/
    ├── login, forgot_password, resetpassword
    └── NotFound, ServerError, ErrorPages
~~~

## Getting started

**Prerequisites:** Node.js 18+ and the backend API running

~~~bash
git clone https://github.com/Vansh1252/school-management-frontend.git
cd school-management-frontend
npm install
~~~

Create a `.env` file:

~~~env
VITE_API_BASE_URL=http://localhost:5000
~~~

Run it:

~~~bash
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview the build
~~~

## Author

**Vansh Jain**: [GitHub](https://github.com/Vansh1252) · sanklechav65@gmail.com
