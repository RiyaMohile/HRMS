import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";

dotenv.config();

const employees = [
  {
    name: "Riya Sharma",
    email: "employee@zeerostock.com",
    phone: "9876543210",
    department: "Engineering",
    designation: "Software Developer",
    dateOfJoining: "2024-06-10",
  },
  {
    name: "Aarav Mehta",
    email: "aarav@zeerostock.com",
    phone: "9876501234",
    department: "Sales",
    designation: "Sales Executive",
    dateOfJoining: "2023-08-21",
  },
  {
    name: "Priya Verma",
    email: "priya@zeerostock.com",
    phone: "9876512345",
    department: "Finance",
    designation: "Accountant",
    dateOfJoining: "2022-04-18",
  },
  {
    name: "Kabir Singh",
    email: "kabir@zeerostock.com",
    phone: "9876523456",
    department: "Operations",
    designation: "Operations Executive",
    dateOfJoining: "2024-01-15",
  },
  {
    name: "Ananya Gupta",
    email: "ananya@zeerostock.com",
    phone: "9876534567",
    department: "HR",
    designation: "HR Executive",
    dateOfJoining: "2023-11-02",
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    // WARNING: This removes existing HRMS data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await Leave.deleteMany({});

    console.log("Existing HRMS data cleared.");

    const hrPassword = await bcrypt.hash("Hr@12345", 12);
    const employeePassword = await bcrypt.hash("Emp@12345", 12);

    // Create HR
    await User.create({
      name: "Neha Kapoor",
      email: "hr@zeerostock.com",
      password: hrPassword,
      role: "HR",
      phone: "9876000000",
      department: "Human Resources",
      designation: "HR Manager",
      dateOfJoining: "2021-02-01",
    });

    // Create employees
    const createdEmployees = [];

    for (const employee of employees) {
      const createdEmployee = await User.create({
        ...employee,
        password: employeePassword,
        role: "EMPLOYEE",
      });

      createdEmployees.push(createdEmployee);
    }

    // Today's date
    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Today's attendance for first 4 employees
    for (const employee of createdEmployees.slice(0, 4)) {
      const checkIn = new Date(today);
      checkIn.setHours(9, 0, 0, 0);

      await Attendance.create({
        employee: employee._id,
        date: today,
        checkIn,
        status: "Present",
      });
    }

    // Yesterday's attendance
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayCheckIn = new Date(yesterday);
    yesterdayCheckIn.setHours(9, 12, 0, 0);

    const yesterdayCheckOut = new Date(yesterday);
    yesterdayCheckOut.setHours(18, 5, 0, 0);

    await Attendance.create({
      employee: createdEmployees[0]._id,
      date: yesterday,
      checkIn: yesterdayCheckIn,
      checkOut: yesterdayCheckOut,
      status: "Present",
    });

    // Pending leave
    const leaveStart = new Date(today);
    leaveStart.setDate(leaveStart.getDate() + 3);
    leaveStart.setHours(0, 0, 0, 0);

    const leaveEnd = new Date(leaveStart);
    leaveEnd.setDate(leaveEnd.getDate() + 1);
    leaveEnd.setHours(0, 0, 0, 0);

    await Leave.create({
      employee: createdEmployees[1]._id,
      leaveType: "Casual",
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: "Personal work",
      status: "Pending",
    });

    // Approved leave
    const previousDay = new Date(today);
    previousDay.setDate(previousDay.getDate() - 1);

    await Leave.create({
      employee: createdEmployees[2]._id,
      leaveType: "Sick",
      startDate: previousDay,
      endDate: previousDay,
      reason: "Not feeling well",
      status: "Approved",
    });

    console.log("");
    console.log("=================================");
    console.log("HRMS database seeded successfully.");
    console.log("=================================");
    console.log("");
    console.log("HR login:");
    console.log("Email: hr@zeerostock.com");
    console.log("Password: Hr@12345");
    console.log("");
    console.log("Employee login:");
    console.log("Email: employee@zeerostock.com");
    console.log("Password: Emp@12345");
    console.log("");

    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (error) {
    console.error("Seed failed:", error);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
}

seed();