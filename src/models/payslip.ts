import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPayslip extends Document {
  employee: Types.ObjectId;
  month: number;
  year: number;
  basicSalary: number;
  netSalary: number;
  generatedBy?: Types.ObjectId | null;
}

const payslipSchema = new Schema<IPayslip>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
    basicSalary: {
      type: Number,
      type: Number,
      required: true,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
      default: 0,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

payslipSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const PayslipModel =
  (mongoose.models.Payslip as Model<IPayslip>) ||
  mongoose.model<IPayslip>("Payslip", payslipSchema);

export { PayslipModel as Payslip };
