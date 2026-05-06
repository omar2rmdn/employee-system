import { redirect } from "next/navigation";
import { Calendar, ClipboardList, FileText } from "lucide-react";
import { getCurrentUser } from "@/actions/auth";
import { EmployeeHomeActions } from "@/components/employee/employee-home-actions";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/attendance";
import { Leave } from "@/models/leave";

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default async function Home() {
  const employee = await getCurrentUser();

  if (!employee) {
    redirect("/login");
  }

  await connectDB();

  const [currentMonthAttendance, pendingLeaves, attendanceHistoryCount] =
    await Promise.all([
      Attendance.countDocuments({
        employee: employee._id,
        status: "PRESENT",
        date: { $gte: startOfMonth() },
      }),
      Leave.countDocuments({
        employee: employee._id,
        status: "PENDING",
      }),
      Attendance.countDocuments({
        employee: employee._id,
      }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {employee.firstName}!</h1>
        <p className="mt-1 font-medium text-gray-500">
          {employee.position} - {employee.department}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-gray-100 border-l-4 border-l-slate-400 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600">Days Present</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{currentMonthAttendance}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2.5">
            <Calendar className="h-5 w-5 text-slate-600" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 border-l-4 border-l-slate-400 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600">Pending Leaves</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{pendingLeaves}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2.5">
            <FileText className="h-5 w-5 text-slate-600" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 border-l-4 border-l-slate-400 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600">Attendance Records</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{attendanceHistoryCount}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2.5">
            <ClipboardList className="h-5 w-5 text-slate-600" />
          </div>
        </div>
      </div>

      <EmployeeHomeActions />
    </div>
  );
}
