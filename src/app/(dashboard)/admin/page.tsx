import { Users, Building, CheckCircle2, FileText } from "lucide-react";
import { dummyAdminDashboardData } from "@/constants/assets";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 font-medium">
          Overview of company statistics
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-slate-400 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Total Employees
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{dummyAdminDashboardData.totalEmployees}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <Users className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-slate-400 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-600">Departments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{dummyAdminDashboardData.totalDepartments}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <Building className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-slate-400 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Today&apos;s Attendance
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{dummyAdminDashboardData.todayAttendance}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-slate-400 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Pending Leaves
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{dummyAdminDashboardData.pendingLeaves}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
