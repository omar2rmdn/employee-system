import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ILeave extends Document {
  employee: Types.ObjectId;
  requestDate: Date;
  reason: string;
  status: LeaveStatus;
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

const LeaveModel =
  (mongoose.models.Leave as Model<ILeave>) ||
  mongoose.model<ILeave>("Leave", leaveSchema);

export { LeaveModel as Leave };
