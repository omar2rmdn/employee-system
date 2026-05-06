import { Metadata } from "next";
import { Users, Building, CheckCircle2, FileText } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/attendance";
import { Department } from "@/models/department";
import { Leave } from "@/models/leave";
import { User } from "@/models/user";
import { startOfDay } from "@/utils";

export const metadata: Metadata = {
  title: "Overview",
};

function getTomorrow(date: Date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

export default async function Home() {
  await connectDB();

  const today = startOfDay(new Date());
  const tomorrow = getTomorrow(today);

  const [
    totalEmployees,
    totalDepartments,
    todayAttendance,
    pendingLeaves,
  ] = await Promise.all([
    User.countDocuments({
      role: "EMPLOYEE",
      isDeleted: false,
    }),
    Department.countDocuments({
      isActive: true,
    }),
    Attendance.countDocuments({
      status: "PRESENT",
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }),
    Leave.countDocuments({
      status: "PENDING",
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 font-medium text-gray-500">
          Overview of company statistics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-100 border-l-4 border-l-slate-400 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Total Employees
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalEmployees}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2.5">
            <Users className="h-5 w-5 text-slate-600" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 border-l-4 border-l-slate-400 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600">Departments</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalDepartments}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2.5">
            <Building className="h-5 w-5 text-slate-600" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 border-l-4 border-l-slate-400 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Today&apos;s Attendance
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {todayAttendance}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2.5">
            <CheckCircle2 className="h-5 w-5 text-slate-600" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 border-l-4 border-l-slate-400 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Pending Leaves
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {pendingLeaves}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2.5">
            <FileText className="h-5 w-5 text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
