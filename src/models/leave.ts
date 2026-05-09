import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ILeave extends Document {
  employee: Types.ObjectId;
  requestDate: Date;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: Types.ObjectId | null;
}

const leaveSchema = new Schema<ILeave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Leave = mongoose.model("Leave", leaveSchema);

export { Leave };
