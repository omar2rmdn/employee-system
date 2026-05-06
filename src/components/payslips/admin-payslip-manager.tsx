"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { createPayslipsForMonth } from "@/actions/payslip";
import {
  formatCurrency,
  getMonthLabel,
  getPayslipPeriodLabel,
} from "@/utils";

interface AdminPayslipItem {
  _id: string;
  month: number;
  year: number;
  basicSalary: number;
  netSalary: number;
  createdAt: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
  };
}

interface Props {
  payslips: AdminPayslipItem[];
  employees: {
    _id: string;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
  }[];
  currentMonth: number;
  currentYear: number;
}

const initialState = undefined;

export function AdminPayslipManager({
  payslips,
  employees,
  currentMonth,
  currentYear,
}: Props) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [state, formAction, isPending] = useActionState(
    createPayslipsForMonth,
    initialState,
  );

  useEffect(() => {
    const form = document.getElementById(
      "payslip-create-form",
    ) as HTMLFormElement | null;

    if (state?.success && form) {
      const timeoutId = window.setTimeout(() => {
        form.reset();
        setIsAddModalOpen(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [state]);

  const periodOptions = useMemo(() => {
    const seen = new Set<string>();

    return payslips.filter((payslip) => {
      const key = `${payslip.year}-${payslip.month}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [payslips]);

  const filteredPayslips = useMemo(() => {
    if (selectedPeriod === "ALL") {
      return payslips;
    }

    const [year, month] = selectedPeriod.split("-");

    return payslips.filter(
      (payslip) =>
        payslip.year === Number(year) && payslip.month === Number(month),
    );
  }, [payslips, selectedPeriod]);

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          disabled={employees.length === 0}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          Add Payslip
        </button>
      </div>

      {state?.success && (
        <div className="mb-6 rounded bg-emerald-100 p-3 text-sm text-emerald-700">
          Created {String(state.createdCount)} payslip.
        </div>
      )}

      {employees.length === 0 && (
        <div className="mb-6 rounded bg-amber-100 p-3 text-sm text-amber-700">
          No active employees are available for manual payslip creation.
        </div>
      )}

      <div className="grid gap-6">
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All Payslips
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review manually created payslips and open a print-ready detail
              page.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(event) => setSelectedPeriod(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
            >
              <option value="ALL">All months</option>
              {periodOptions.map((payslip) => (
                <option
                  key={`${payslip.year}-${payslip.month}`}
                  value={`${payslip.year}-${payslip.month}`}
                >
                  {getMonthLabel(payslip.month)} {payslip.year}
                </option>
              ))}
            </select>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
              {filteredPayslips.length} payslips
            </span>
          </div>
        </div>

        {filteredPayslips.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            {payslips.length === 0
              ? "No payslips created yet."
              : "No payslips found for the selected month."}
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
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Basic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Net
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayslips.map((payslip) => (
                  <tr key={payslip._id} className="text-sm text-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {payslip.employee.firstName} {payslip.employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payslip.employee.department} • {payslip.employee.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {getPayslipPeriodLabel(payslip.month, payslip.year)}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(payslip.basicSalary)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatCurrency(payslip.netSalary)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/payslips/${payslip._id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Add Payslip
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Create one payslip at a time for a selected active employee using
              that employee&apos;s current basic salary.
            </p>

            <form
              id="payslip-create-form"
              action={formAction}
              className="grid gap-4 md:grid-cols-4"
            >
              {state?.error && (
                <div className="md:col-span-4 rounded bg-red-100 p-3 text-sm text-red-600">
                  {state.error as string}
                </div>
              )}

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Employee
                </label>
                <select
                  name="employeeId"
                  disabled={isPending || employees.length === 0}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.firstName} {employee.lastName} -{" "}
                      {employee.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Month
                </label>
                <select
                  name="month"
                  defaultValue={String(currentMonth)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map(
                    (month) => (
                      <option key={month} value={month}>
                        {getMonthLabel(month)}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  min={2000}
                  max={9999}
                  defaultValue={currentYear}
                  disabled={isPending}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div className="md:col-span-4 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isPending}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || employees.length === 0}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create Payslip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
