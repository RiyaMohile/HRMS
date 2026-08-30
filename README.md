# Zeerostock HRMS — React JavaScript + Tailwind + shadcn/ui + Express + MongoDB

A complete assignment-ready Human Resource Management System built with:
- React + Vite
- JavaScript / JSX
- Tailwind CSS
- shadcn/ui-style components using Radix primitives
- React Router
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- HR and Employee role-based authorization

## Project structure

```text
zeerostock-hrms-react-js/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui primitives
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── shared/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── components.json
│   ├── jsconfig.json
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 1. MongoDB

Start local MongoDB or use MongoDB Atlas.

Default local URI:

```text
mongodb://127.0.0.1:27017/zeerostock_hrms
```

## 2. Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zeerostock_hrms
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=1d
```

Seed database:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

## 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Demo credentials

HR:

```text
Email: hr@zeerostock.com
Password: Hr@12345
```

Employee:

```text
Email: employee@zeerostock.com
Password: Emp@12345
```

Other seeded employees use:

```text
Password: Emp@12345
```

## Functional requirements

### Authentication
- Login
- Logout
- bcrypt password hashing
- JWT authentication
- Role-based authorization
- Protected frontend routes
- Protected backend APIs

### HR Portal
Dashboard:
- Total Employees
- Employees Present Today
- Employees on Leave
- Pending leave count
- Recent attendance activity
- Recent leave requests

Employee Management:
- Add employee
- Edit employee
- Search employee
- Employee list
- Name
- Email
- Phone
- Department
- Designation
- Date of joining

Attendance:
- Filter by employee
- Filter by date
- Check-in/check-out times
- Attendance status

Leave:
- View requests
- Filter status
- Approve
- Reject

### Employee Portal
Dashboard:
- Personal information
- Today's attendance
- Leave balance
- Department/designation

Attendance:
- Check In
- Check Out
- Attendance history

Leave:
- Apply for leave
- View status
- Leave history

Profile:
- View profile
- Edit name and phone
- Change password

## API endpoints

### Auth

```http
POST /api/auth/login
GET /api/auth/me
```

### Dashboard

```http
GET /api/dashboard
```

### Employees — HR only

```http
GET /api/employees
GET /api/employees/:id
POST /api/employees
PUT /api/employees/:id
```

### Attendance

```http
GET /api/attendance
GET /api/attendance/me
POST /api/attendance/check-in
POST /api/attendance/check-out
```

### Leaves

```http
GET /api/leaves
POST /api/leaves
PUT /api/leaves/:id
```

### Profile

```http
GET /api/profile
PUT /api/profile
PUT /api/profile/change-password
```

## Authentication flow

```text
Login Form
    ↓
POST /api/auth/login
    ↓
bcrypt password verification
    ↓
JWT generated
    ↓
Frontend stores JWT
    ↓
Authorization: Bearer <token>
    ↓
Backend JWT middleware
    ↓
Role authorization
    ↓
Protected resource
```

## Role permissions

```text
HR
 ├── Dashboard
 ├── Employee Management
 ├── Attendance Management
 └── Leave Management

Employee
 ├── Dashboard
 ├── My Attendance
 ├── My Leave Requests
 └── My Profile
```

## Database relationships

```text
User
 ├── Attendance.employee → User._id
 └── Leave.employee      → User._id
```

An HR user is stored in the same User collection with `role: HR`.
Employees use `role: EMPLOYEE`.

## Notes

This is designed as an assignment/demo application rather than a production HRMS. In a production system, add refresh-token rotation, stronger validation, audit logs, CSRF protection where applicable, rate limiting, pagination, granular permissions, centralized error handling, automated tests, and secure cookie-based authentication.
