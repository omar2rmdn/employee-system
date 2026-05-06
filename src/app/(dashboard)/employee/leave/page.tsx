import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { EmployeeLeaveManager } from "@/components/leave/employee-leave-manager";
import { connectDB } from "@/lib/db";
import { Leave } from "@/models/leave";

export const metadata: Metadata = {
  title: "Leave",
};

export default async function LeavePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await connectDB();

  const leaves = await Leave.find({ employee: user._id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leave</h1>
        <p className="mt-2 text-sm text-gray-500">
          Submit leave requests for admin approval.
        </p>
      </div>

      <EmployeeLeaveManager leaves={JSON.parse(JSON.stringify(leaves))} />
    </div>
  );
}
