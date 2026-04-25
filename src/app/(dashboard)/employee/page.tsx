import { Calendar, FileText, DollarSign, ArrowRight } from "lucide-react";
import { dummyEmployeeDashboardData } from "@/constants/assets";

export default function Home() {
  const { employee, currentMonthAttendance, pendingLeaves, latestPayslip } = dummyEmployeeDashboardData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {employee.firstName}!</h1>
        <p className="text-gray-500 mt-1 font-medium">
          {employee.position} - {employee.department}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-slate-400 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-600">Days Present</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{currentMonthAttendance}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <Calendar className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-slate-400 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Pending Leaves
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{pendingLeaves}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-slate-400 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Latest Payslip
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">${latestPayslip.netSalary.toLocaleString()}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg">
            <DollarSign className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm">
          Mark Attendance <ArrowRight className="w-4 h-4" />
        </button>
        <button className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors shadow-sm">
          Apply for Leave
        </button>
      </div>
    </div>
  );
}
