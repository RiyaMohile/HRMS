import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

async function getEmployees(req, res) {
  try {
    const search = String(req.query.search || "").trim();
    const filter = { role: "EMPLOYEE", active: true };

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { name: regex },
        { email: regex },
        { department: regex },
        { designation: regex }
      ];
    }

    const employees = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees"
    });
  }
}

async function getEmployee(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid employee ID"
    });
  }

  const employee = await User.findOne({
    _id: req.params.id,
    role: "EMPLOYEE"
  }).select("-password");

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  res.json({
    success: true,
    data: employee
  });
}

async function createEmployee(req, res) {
  try {
    const {
      name,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      password = "Employee@123"
    } = req.body;

    if (!name || !email || !department || !designation || !dateOfJoining) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, department, designation and date of joining are required"
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const employee = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "EMPLOYEE",
      phone,
      department,
      designation,
      dateOfJoining
    });

    const safe = employee.toObject();
    delete safe.password;

    res.status(201).json({
      success: true,
      data: safe,
      message: "Employee created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create employee"
    });
  }
}

async function updateEmployee(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID"
      });
    }

    const allowed = [
      "name",
      "email",
      "phone",
      "department",
      "designation",
      "dateOfJoining"
    ];

    const updates = {};

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
    }

    const employee = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "EMPLOYEE"
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.json({
      success: true,
      data: employee,
      message: "Employee updated successfully"
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already belongs to another account"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update employee"
    });
  }
}

export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee
};