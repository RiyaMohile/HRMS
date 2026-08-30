import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

function safeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    department: user.department,
    designation: user.designation,
    dateOfJoining: user.dateOfJoining
  };
}

async function login(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.json({
      success: true,
      data: {
        token: signToken(user),
        user: safeUser(user)
      }
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
}

async function me(req, res) {
  res.json({
    success: true,
    data: safeUser(req.user)
  });
}

export { login, me };