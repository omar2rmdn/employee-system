import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  role: "ADMIN" | "EMPLOYEE";
  refreshToken?: string;
  department: string;
  firstName: string;
  lastName: string;
  phone: string;
  position: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  employmentStatus: "ACTIVE" | "INACTIVE" | "TERMINATED" | "ON_LEAVE";
  joinDate: Date;
  image: string | null;
  isDeleted: boolean;
  bio: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    role: {
      type: String,
      required: true,
      enum: ["EMPLOYEE", "ADMIN"],
      default: "EMPLOYEE",
    },
    refreshToken: {
      type: String,
    },
    department: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    employmentStatus: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE", "TERMINATED", "ON_LEAVE"],
      default: "ACTIVE",
    },
    joinDate: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export { User };
