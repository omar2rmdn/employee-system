 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  formatCurrency,
  getMonthLabel,
  getPayslipPeriodLabel,
} from "@/utils";

interface EmployeePayslipItem {
  _id: string;
  month: number;
  year: number;
  basicSalary: number;
  netSalary: number;
  createdAt: string;
}

interface Props {
  payslips: EmployeePayslipItem[];
}

export function EmployeePayslipList({ payslips }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");

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

  const latestPayslip = filteredPayslips[0];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Payslips</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {payslips.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Latest Period</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {latestPayslip
              ? getPayslipPeriodLabel(latestPayslip.month, latestPayslip.year)
              : "-"}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Latest Net Salary</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-900">
            {latestPayslip ? formatCurrency(latestPayslip.netSalary) : "-"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Payslips
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Each generated month appears here with a detailed printable view.
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
              ? "No payslips available yet."
              : "No payslips found for the selected month."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
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
                        href={`/employee/payslips/${payslip._id}`}
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
  );
}
