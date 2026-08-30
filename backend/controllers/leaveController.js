import mongoose from "mongoose";
import Leave from "../models/Leave.js";

function daysInclusive(start, end) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.floor((new Date(end) - new Date(start)) / ms) + 1;
}

async function getLeaves(req, res) {
  try {
    const filter = {};

    if (req.user.role === "EMPLOYEE") {
      filter.employee = req.user._id;
    }

    if (req.query.status) {
      if (!["Pending", "Approved", "Rejected"].includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leave status"
        });
      }

      filter.status = req.query.status;
    }

    const leaves = await Leave.find(filter)
      .populate("employee", "name email department designation")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave requests"
    });
  }
}

async function applyLeave(req, res) {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason = ""
    } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Leave type, start date and end date are required"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave date range"
      });
    }

    const overlapping = await Leave.findOne({
      employee: req.user._id,
      status: {
        $in: ["Pending", "Approved"]
      },
      startDate: {
        $lte: end
      },
      endDate: {
        $gte: start
      }
    });

    if (overlapping) {
      return res.status(409).json({
        success: false,
        message:
          "You already have a pending/approved leave in this date range"
      });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason
    });

    res.status(201).json({
      success: true,
      data: leave,
      message: "Leave request submitted"
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to submit leave request"
    });
  }
}

async function updateLeave(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave request ID"
      });
    }

    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Approved or Rejected"
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("employee", "name email department");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    res.json({
      success: true,
      data: leave,
      message: `Leave request ${status.toLowerCase()}`
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update leave request"
    });
  }
}

export {
  getLeaves,
  applyLeave,
  updateLeave,
  daysInclusive
};