"use client";

import { useActionState, useMemo } from "react";
import { reviewLeaveRequest } from "@/actions/leave";

interface LeaveItem {
  _id: string;
  requestDate: string;
  createdAt?: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  employee: {
    firstName: string;
    lastName: string;
    department: string;
  };
  approvedBy?: {
    firstName: string;
    lastName: string;
  } | null;
}

interface AdminLeaveManagerProps {
  leaves: LeaveItem[];
}

const initialState = undefined;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function AdminLeaveManager({ leaves }: AdminLeaveManagerProps) {
  const [state, formAction, isPending] = useActionState(
    reviewLeaveRequest,
    initialState,
  );
  const pendingLeaves = useMemo(
    () => leaves.filter((leave) => leave.status === "PENDING"),
    [leaves],
  );
  const reviewedLeaves = useMemo(
    () => leaves.filter((leave) => leave.status !== "PENDING"),
    [leaves],
  );

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{leaves.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">Pending Review</p>
          <p className="mt-2 text-3xl font-semibold text-amber-900">{pendingLeaves.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Reviewed</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-900">{reviewedLeaves.length}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Pending Leave Requests</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review requests here. Approval uses the rules in `reviewLeaveRequest`, including attendance validation and automatic day-type calculation.
          </p>
        </div>

        {state?.error && (
          <div className="mx-6 mt-6 rounded bg-red-100 p-3 text-sm text-red-600">
            {state.error as string}
          </div>
        )}

        {state?.success && (
          <div className="mx-6 mt-6 rounded bg-emerald-100 p-3 text-sm text-emerald-700">
            Leave request reviewed successfully.
          </div>
        )}

        {pendingLeaves.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            No pending leave requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingLeaves.map((leave) => (
                  <tr key={leave._id} className="text-sm text-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {leave.employee.firstName} {leave.employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{leave.employee.department}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatDate(leave.requestDate)}
                    </td>
                    <td className="px-6 py-4">{leave.reason || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <form action={formAction}>
                          <input type="hidden" name="id" value={leave._id} />
                          <input type="hidden" name="decision" value="APPROVED" />
                          <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </form>

                        <form action={formAction}>
                          <input type="hidden" name="id" value={leave._id} />
                          <input type="hidden" name="decision" value="REJECTED" />
                          <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Reviewed Requests</h2>
          <p className="mt-1 text-sm text-gray-500">
            Approved and rejected leave requests are listed here for audit and follow-up.
          </p>
        </div>

        {reviewedLeaves.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            No reviewed leave requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reviewed By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviewedLeaves.map((leave) => (
                  <tr key={leave._id} className="text-sm text-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {leave.employee.firstName} {leave.employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{leave.employee.department}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatDate(leave.requestDate)}
                    </td>
                    <td className="px-6 py-4">{leave.reason || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          leave.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {leave.approvedBy
                        ? `${leave.approvedBy.firstName} ${leave.approvedBy.lastName}`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
