"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/actions/auth";
import { connectDB } from "@/lib/db";
import { Payslip } from "@/models/payslip";
import { User } from "@/models/user";

export async function createPayslipsForMonth(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "You must be logged in to create a payslip." };
    }

    await connectDB();

    const admin = await User.findById(currentUser._id);
    if (!admin || admin.isDeleted || admin.role !== "ADMIN") {
      return { error: "Only admins can create payslips." };
    }

    const employeeId = formData.get("employeeId") as string;
    if (!employeeId) {
      return { error: "Please select an employee." };
    }

    const month = Number(formData.get("month"));
    const year = Number(formData.get("year"));

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return { error: "Please select a valid month." };
    }

    if (!Number.isInteger(year) || year < 2000 || year > 9999) {
      return { error: "Please enter a valid year." };
    }

    const employee = await User.findOne({
      _id: employeeId,
      role: "EMPLOYEE",
      isDeleted: false,
      employmentStatus: "ACTIVE",
    }).select("basicSalary");

    if (!employee) {
      return { error: "Selected employee was not found or is not active." };
    }

    const existingPayslip = await Payslip.findOne({
      employee: employee._id,
      month,
      year,
    }).select("_id");

    if (existingPayslip) {
      return {
        error: "A payslip already exists for this employee and period.",
      };
    }

    const basicSalary = employee.basicSalary || 0;

    await Payslip.create({
      employee: employee._id,
      month,
      year,
      basicSalary,
      netSalary: Math.max(0, basicSalary),
      generatedBy: admin._id,
    });

    revalidatePath("/admin/payslips");
    revalidatePath("/employee/payslips");

    return {
      success: true,
      createdCount: 1,
    };
  } catch (error: unknown) {
    console.error("Create payslip error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create payslip.",
    };
  }
}
