import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { AdminLeaveManager } from "@/components/leave/admin-leave-manager";
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

  if (user.role !== "ADMIN") {
    redirect("/employee");
  }

  await connectDB();

  const leaves = await Leave.find()
    .populate("employee", "firstName lastName department")
    .populate("approvedBy", "firstName lastName")
    .sort({ status: 1, createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leave</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review leave requests and add approved dates to employee attendance history.
        </p>
      </div>

      <AdminLeaveManager leaves={JSON.parse(JSON.stringify(leaves))} />
    </div>
  );
}
