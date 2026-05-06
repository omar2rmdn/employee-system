"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/actions/auth";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/attendance";
import { Leave } from "@/models/leave";
import { User } from "@/models/user";
import { formatTime, getDayType, startOfDay } from "@/utils";

export async function createLeaveRequest(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "You must be logged in to request leave." };
    }

    await connectDB();

    const employee = await User.findById(currentUser._id);
    if (!employee || employee.isDeleted || employee.role !== "EMPLOYEE") {
      return { error: "Employee account was not found." };
    }

    const reason = ((formData.get("reason") as string) || "").trim();

    const requestDate = startOfDay(new Date());

    const overlappingLeave = await Leave.findOne({
      employee: employee._id,
      status: { $in: ["PENDING", "APPROVED"] },
      requestDate,
    });

    if (overlappingLeave) {
      return {
        error:
          "There is already a pending or approved leave request for today.",
      };
    }

    await Leave.create({
      employee: employee._id,
      requestDate,
      reason,
      status: "PENDING",
    });

    revalidatePath("/employee");
    revalidatePath("/employee/leave");

    return { success: true };
  } catch (error: unknown) {
    console.error("Create leave request error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit leave request.",
    };
  }
}

export async function reviewLeaveRequest(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "You must be logged in to review leave." };
    }

    await connectDB();

    const admin = await User.findById(currentUser._id);
    if (!admin || admin.isDeleted || admin.role !== "ADMIN") {
      return { error: "Only admins can review leave requests." };
    }

    const leaveId = formData.get("id") as string;
    const decision = formData.get("decision") as string;

    if (!leaveId) {
      return { error: "Leave request ID is required." };
    }

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return { error: "Invalid leave decision." };
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return { error: "Leave request not found." };
    }

    if (leave.status !== "PENDING") {
      return { error: "This leave request has already been reviewed." };
    }

    if (decision === "APPROVED") {
      const attendanceRecord = await Attendance.findOne({
        employee: leave.employee,
        date: startOfDay(leave.requestDate),
      });

      if (!attendanceRecord || !attendanceRecord.checkIn) {
        return {
          error:
            "Cannot approve leave until the employee has marked attendance for that date.",
        };
      }

      const approvalTime = formatTime(new Date());
      const dayType = getDayType(attendanceRecord.checkIn, approvalTime);

      if (!dayType) {
        return {
          error: "Attendance check-in time is invalid for this record.",
        };
      }

      attendanceRecord.checkOut = approvalTime;
      attendanceRecord.dayType = dayType;
      attendanceRecord.status = "PRESENT";
      await attendanceRecord.save();
    }

    leave.status = decision as "APPROVED" | "REJECTED";
    leave.approvedBy = admin._id;
    await leave.save();

    revalidatePath("/admin/leave");
    revalidatePath("/employee");
    revalidatePath("/employee/leave");
    revalidatePath("/employee/attendance");

    return { success: true };
  } catch (error: unknown) {
    console.error("Review leave request error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to review leave request.",
    };
  }
}
