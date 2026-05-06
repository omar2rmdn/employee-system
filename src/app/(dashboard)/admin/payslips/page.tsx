import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { AdminPayslipManager } from "@/components/payslips/admin-payslip-manager";
import { connectDB } from "@/lib/db";
import { Payslip } from "@/models/payslip";
import { User } from "@/models/user";

export const metadata: Metadata = {
  title: "Payslips",
};

export default async function Payslips() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/employee/payslips");
  }

  await connectDB();

  const employees = await User.find({
    role: "EMPLOYEE",
    isDeleted: false,
    employmentStatus: "ACTIVE",
  })
    .select("firstName lastName department position")
    .sort({ firstName: 1, lastName: 1 })
    .lean();

  const payslips = await Payslip.find()
    .populate("employee", "firstName lastName department position")
    .sort({ year: -1, month: -1, createdAt: -1 })
    .lean();

  const now = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payslips</h1>
        <p className="mt-2 text-sm text-gray-500">
          Create payslips manually for individual employees and review issued
          salary statements.
        </p>
      </div>

      <AdminPayslipManager
        payslips={JSON.parse(JSON.stringify(payslips))}
        employees={JSON.parse(JSON.stringify(employees))}
        currentMonth={now.getMonth() + 1}
        currentYear={now.getFullYear()}
      />
    </div>
  );
}
