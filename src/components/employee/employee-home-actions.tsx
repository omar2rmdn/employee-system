"use client";

import { useActionState } from "react";
import { markAttendanceNow } from "@/actions/attendance";

const initialState = undefined;

export function EmployeeHomeActions() {
  const [state, formAction, isPending] = useActionState(
    markAttendanceNow,
    initialState,
  );

  return (
    <div className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600">
          {state.error as string}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
          Attendance marked for today.
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <form action={formAction}>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg bg-[#4f46e5] px-5 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "Marking..." : "Mark Attendance"}
          </button>
        </form>

        <a
          href="/employee/leave"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Apply for Leave
        </a>
      </div>
    </div>
  );
}
