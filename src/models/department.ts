import mongoose, { Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description: string;
  isActive: boolean;
}

const departmentSchema = new mongoose.Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

departmentSchema.index({ name: 1 }, { unique: true });

const Department =
  mongoose.models.Department ||
  mongoose.model<IDepartment>("Department", departmentSchema);

export { Department };
