"use client";

import { useActionState, useEffect } from "react";
import { createLeaveRequest } from "@/actions/leave";

interface LeaveItem {
  _id: string;
  requestDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface EmployeeLeaveManagerProps {
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

export function EmployeeLeaveManager({ leaves }: EmployeeLeaveManagerProps) {
  const [state, formAction, isPending] = useActionState(
    createLeaveRequest,
    initialState,
  );

  useEffect(() => {
    const form = document.getElementById("leave-form") as HTMLFormElement | null;

    if (state?.success && form) {
      const timeoutId = window.setTimeout(() => {
        form.reset();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [state]);

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Request Leave</h2>
          <p className="mt-1 text-sm text-gray-500">
            This requests leave for today only. Day type is calculated automatically from check-in and admin approval time.
          </p>
        </div>

        <form id="leave-form" action={formAction} className="grid gap-4">
          {state?.error && (
            <div className="rounded bg-red-100 p-3 text-sm text-red-600">
              {state.error as string}
            </div>
          )}

          {state?.success && (
            <div className="rounded bg-emerald-100 p-3 text-sm text-emerald-700">
              Leave request submitted.
            </div>
          )}

          <div className="md:col-span-2">
            <label htmlFor="reason" className="mb-1 block text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              disabled={isPending}
              placeholder="Optional"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Submit Leave Request"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leave History</h2>
            <p className="mt-1 text-sm text-gray-500">Pending and reviewed requests appear here.</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {leaves.length} requests
          </span>
        </div>

        {leaves.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            No leave requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="text-sm text-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatDate(leave.requestDate)}
                    </td>
                    <td className="px-6 py-4">{leave.reason || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          leave.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : leave.status === "REJECTED"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {leave.status}
                      </span>
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
