import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import User from "../models/User.js";

import {
  startOfDay,
  endOfDay
} from "./attendanceController.js";

async function hrDashboard(req, res) {
  const todayStart = startOfDay();
  const todayEnd = endOfDay();

  const totalEmployees = await User.countDocuments({
    role: "EMPLOYEE",
    active: true
  });

  const presentToday = await Attendance.countDocuments({
    date: {
      $gte: todayStart,
      $lte: todayEnd
    },
    status: "Present"
  });

  const onLeaveToday = await Leave.countDocuments({
    status: "Approved",
    startDate: {
      $lte: todayEnd
    },
    endDate: {
      $gte: todayStart
    }
  });

  const pendingLeaves = await Leave.countDocuments({
    status: "Pending"
  });

  const recentAttendance = await Attendance.find()
    .populate("employee", "name department")
    .sort({ createdAt: -1 })
    .limit(8);

  const recentLeaves = await Leave.find()
    .populate("employee", "name department")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalEmployees,
      presentToday,
      onLeaveToday,
      pendingLeaves,
      recentAttendance,
      recentLeaves
    }
  });
}

async function employeeDashboard(req, res) {
  const todayStart = startOfDay();
  const todayEnd = endOfDay();

  const todayAttendance = await Attendance.findOne({
    employee: req.user._id,
    date: {
      $gte: todayStart,
      $lte: todayEnd
    }
  });

  const leaves = await Leave.find({
    employee: req.user._id,
    status: "Approved"
  });

  // Demo leave policy: 24 days annual allocation.
  const usedDays = leaves.reduce((sum, item) => {
    const ms = 24 * 60 * 60 * 1000;

    return (
      sum +
      Math.floor(
        (new Date(item.endDate) - new Date(item.startDate)) / ms
      ) +
      1
    );
  }, 0);

  const leaveBalance = Math.max(0, 24 - usedDays);

  res.json({
    success: true,
    data: {
      todayAttendance,
      leaveBalance
    }
  });
}

async function getDashboard(req, res) {
  if (req.user.role === "HR") {
    return hrDashboard(req, res);
  }

  return employeeDashboard(req, res);
}

export { getDashboard };