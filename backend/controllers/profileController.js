import bcrypt from "bcryptjs";
import User from "../models/User.js";

function safe(user) {
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

async function getProfile(req, res) {
  res.json({
    success: true,
    data: safe(req.user)
  });
}

async function updateProfile(req, res) {
  const updates = {};

  if (req.body.name !== undefined) {
    updates.name = req.body.name.trim();
  }

  if (req.body.phone !== undefined) {
    updates.phone = req.body.phone.trim();
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    data: safe(user),
    message: "Profile updated successfully"
  });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current and new passwords are required"
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters"
    });
  }

  const user = await User.findById(req.user._id).select("+password");

  const valid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!valid) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect"
    });
  }

  user.password = await bcrypt.hash(newPassword, 12);

  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully"
  });
}

export {
  getProfile,
  updateProfile,
  changePassword
};