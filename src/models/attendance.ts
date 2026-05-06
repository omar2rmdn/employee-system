import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type AttendanceDayType = "" | "FULL" | "HALF";
export type AttendanceStatus = "PRESENT" | "ABSENT";

export interface IAttendance extends Document {
  employee: Types.ObjectId;
  date: Date;
  checkIn: string;
  checkOut: string;
  dayType: AttendanceDayType;
  status: AttendanceStatus;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: String,
      default: "",
      trim: true,
    },
    checkOut: {
      type: String,
      default: "",
      trim: true,
    },
    dayType: {
      type: String,
      enum: ["", "FULL", "HALF"],
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["PRESENT", "ABSENT"],
      default: "PRESENT",
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const AttendanceModel =
  (mongoose.models.Attendance as Model<IAttendance>) ||
  mongoose.model<IAttendance>("Attendance", attendanceSchema);

export { AttendanceModel as Attendance };
