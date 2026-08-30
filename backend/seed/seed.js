require("dotenv").config();

import mongoose from "mongoose";
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

const employees = [
  {
    name: "Riya Sharma",
    email: "employee@zeerostock.com",
    phone: "9876543210",
    department: "Engineering",
    designation: "Software Developer",
    dateOfJoining: "2024-06-10"
  },
  {
    name: "Aarav Mehta",
    email: "aarav@zeerostock.com",
    phone: "9876501234",
    department: "Sales",
    designation: "Sales Executive",
    dateOfJoining: "2023-08-21"
  },
  {
    name: "Priya Verma",
    email: "priya@zeerostock.com",
    phone: "9876512345",
    department: "Finance",
    designation: "Accountant",
    dateOfJoining: "2022-04-18"
  },
  {
    name: "Kabir Singh",
    email: "kabir@zeerostock.com",
    phone: "9876523456",
    department: "Operations",
    designation: "Operations Executive",
    dateOfJoining: "2024-01-15"
  },
  {
    name: "Ananya Gupta",
    email: "ananya@zeerostock.com",
    phone: "9876534567",
    department: "HR",
    designation: "HR Executive",
    dateOfJoining: "2023-11-02"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});
  await Attendance.deleteMany({});
  await Leave.deleteMany({});

  const hrPassword = await bcrypt.hash("Hr@12345", 12);
  const employeePassword = await bcrypt.hash("Emp@12345", 12);

  const hr = await User.create({
    name: "Neha Kapoor",
    email: "hr@zeerostock.com",
    password: hrPassword,
    role: "HR",
    phone: "9876000000",
    department: "Human Resources",
    designation: "HR Manager",
    dateOfJoining: "2021-02-01"
  });

  const createdEmployees = [];

  for (const employee of employees) {
    createdEmployees.push(
      await User.create({
        ...employee,
        password: employee.email === "employee@zeerostock.com" ? employeePassword : await bcrypt.hash("Emp@12345", 12),
        role: "EMPLOYEE"
      })
    );
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  for (const employee of createdEmployees.slice(0, 4)) {
    const checkIn = new Date();
    checkIn.setHours(9, 0, 0, 0);

    await Attendance.create({
      employee: employee._id,
      date: today,
      checkIn,
      status: "Present"
    });
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await Attendance.create({
    employee: createdEmployees[0]._id,
    date: yesterday,
    checkIn: new Date(yesterday.setHours(9, 12, 0, 0)),
    checkOut: new Date(yesterday.setHours(18, 5, 0, 0)),
    status: "Present"
  });

  const leaveStart = new Date();
  leaveStart.setDate(leaveStart.getDate() + 3);
  leaveStart.setHours(0, 0, 0, 0);

  const leaveEnd = new Date(leaveStart);
  leaveEnd.setDate(leaveEnd.getDate() + 1);

  await Leave.create({
    employee: createdEmployees[1]._id,
    leaveType: "Casual",
    startDate: leaveStart,
    endDate: leaveEnd,
    reason: "Personal work",
    status: "Pending"
  });

  await Leave.create({
    employee: createdEmployees[2]._id,
    leaveType: "Sick",
    startDate: new Date(today.getTime() - 86400000),
    endDate: new Date(today.getTime() - 86400000),
    reason: "Not feeling well",
    status: "Approved"
  });

  console.log("HRMS database seeded successfully.");
  console.log("HR login: hr@zeerostock.com / Hr@12345");
  console.log("Employee login: employee@zeerostock.com / Emp@12345");

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
