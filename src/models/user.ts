import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
  refreshToken?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    required: true,
    enum: ["employee", "admin"],
    default: "employee",
  },
  refreshToken: {
    type: String,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export { User };
