import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    leaveType: {
      type: String,
      enum: ["Casual", "Sick", "Earned", "Unpaid"],
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    reason: {
      type: String,
      default: "",
      trim: true
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true
    }
  },
  {
    timestamps: true
  }
);

leaveSchema.index({
  employee: 1,
  startDate: 1
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;