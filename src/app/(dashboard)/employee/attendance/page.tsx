import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { AttendanceHistory } from "@/components/attendance/attendance-history";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/attendance";

export const metadata: Metadata = {
  title: "Attendance",
};

export default async function AttendancePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await connectDB();

  const attendanceRecords = await Attendance.find({
    employee: user._id,
  })
    .sort({ date: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-2 text-sm text-gray-500">
          View attendance history only. Records are created from the home page attendance button or approved leave.
        </p>
      </div>

      <AttendanceHistory records={JSON.parse(JSON.stringify(attendanceRecords))} />
    </div>
  );
}
