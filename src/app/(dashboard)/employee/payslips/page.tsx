import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { EmployeePayslipList } from "@/components/payslips/employee-payslip-list";
import { connectDB } from "@/lib/db";
import { Payslip } from "@/models/payslip";

export default async function Payslips() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "EMPLOYEE") {
    redirect("/admin/payslips");
  }

  await connectDB();

  const payslips = await Payslip.find({ employee: user._id })
    .sort({ year: -1, month: -1, createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payslips</h1>
        <p className="mt-2 text-sm text-gray-500">
          View your monthly payslips and open each statement in detail.
        </p>
      </div>

      <EmployeePayslipList payslips={JSON.parse(JSON.stringify(payslips))} />
    </div>
  );
}
