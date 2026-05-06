"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/actions/auth";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/attendance";
import { User } from "@/models/user";
import { formatTime, startOfDay } from "@/utils";

export async function markAttendanceNow(prevState: unknown) {
  try {
    void prevState;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "You must be logged in to manage attendance." };
    }

    await connectDB();

    const employee = await User.findById(currentUser._id);
    if (!employee || employee.isDeleted || employee.role !== "EMPLOYEE") {
      return { error: "Employee account was not found." };
    }

    const now = new Date();
    const date = startOfDay(now);
    const existingRecord = await Attendance.findOne({
      employee: employee._id,
      date,
    });

    if (existingRecord?.status === "ABSENT") {
      return {
        error:
          "Today already exists in attendance history through an approved leave request.",
      };
    }

    if (existingRecord?.status === "PRESENT") {
      return { error: "Attendance has already been marked for today." };
    }

    await Attendance.create({
      employee: employee._id,
      date,
      checkIn: formatTime(now),
      checkOut: "",
      dayType: "",
      status: "PRESENT",
    });

    revalidatePath("/employee");
    revalidatePath("/employee/attendance");

    return { success: true };
  } catch (error: unknown) {
    console.error("Mark attendance error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to mark attendance.",
    };
  }
}
