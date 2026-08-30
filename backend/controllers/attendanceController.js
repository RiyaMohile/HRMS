import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";

function startOfDay(value = new Date()) {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(value = new Date()) {
  const d = new Date(value);
  d.setHours(23, 59, 59, 999);
  return d;
}

async function getAttendance(req, res) {
  try {
    const { employeeId, date } = req.query;
    const filter = {};

    if (employeeId) {
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID"
        });
      }

      filter.employee = employeeId;
    }

    if (date) {
      const parsed = new Date(date);

      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date"
        });
      }

      filter.date = {
        $gte: startOfDay(parsed),
        $lte: endOfDay(parsed)
      };
    }

    const records = await Attendance.find(filter)
      .populate("employee", "name email department designation")
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance"
    });
  }
}

async function checkIn(req, res) {
  try {
    const now = new Date();
    const day = startOfDay(now);

    let record = await Attendance.findOne({
      employee: req.user._id,
      date: day
    });

    if (record?.checkIn) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in today"
      });
    }

    if (!record) {
      record = await Attendance.create({
        employee: req.user._id,
        date: day,
        checkIn: now,
        status: "Present"
      });
    } else {
      record.checkIn = now;
      record.status = "Present";
      await record.save();
    }

    res.status(201).json({
      success: true,
      data: record,
      message: "Check-in successful"
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Check-in failed"
    });
  }
}

async function checkOut(req, res) {
  try {
    const day = startOfDay(new Date());

    const record = await Attendance.findOne({
      employee: req.user._id,
      date: day
    });

    if (!record || !record.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Please check in before checking out"
      });
    }

    if (record.checkOut) {
      return res.status(400).json({
        success: false,
        message: "You have already checked out today"
      });
    }

    record.checkOut = new Date();
    await record.save();

    res.json({
      success: true,
      data: record,
      message: "Check-out successful"
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Check-out failed"
    });
  }
}

async function getMyAttendance(req, res) {
  const today = await Attendance.findOne({
    employee: req.user._id,
    date: startOfDay(new Date())
  });

  const history = await Attendance.find({
    employee: req.user._id
  })
    .sort({ date: -1 })
    .limit(100);

  res.json({
    success: true,
    data: {
      today,
      history
    }
  });
}

export {
  getAttendance,
  checkIn,
  checkOut,
  getMyAttendance,
  startOfDay,
  endOfDay
};