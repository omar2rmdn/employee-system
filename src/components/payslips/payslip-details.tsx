import Link from "next/link";
import { formatCurrency, getPayslipPeriodLabel } from "@/utils";

interface PayslipDetailsProps {
  payslip: {
    _id: string;
    month: number;
    year: number;
    basicSalary: number;
    netSalary: number;
    employee: {
      firstName: string;
      lastName: string;
      email: string;
      department: string;
      position: string;
    };
  };
  backHref: string;
}

export function PayslipDetails({ payslip, backHref }: PayslipDetailsProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payslip</h1>
          <p className="mt-2 text-sm text-gray-500">
            {getPayslipPeriodLabel(payslip.month, payslip.year)}
          </p>
        </div>
        <Link
          href={backHref}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Back
        </Link>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 border-b border-gray-100 pb-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Employee</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">
              {payslip.employee.firstName} {payslip.employee.lastName}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{payslip.employee.email}</p>
          </div>
          <div className="grid gap-3 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">Department:</span>{" "}
              {payslip.employee.department}
            </div>
            <div>
              <span className="font-medium text-gray-900">Position:</span>{" "}
              {payslip.employee.position}
            </div>
            <div>
              <span className="font-medium text-gray-900">Period:</span>{" "}
              {getPayslipPeriodLabel(payslip.month, payslip.year)}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Basic Salary</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {formatCurrency(payslip.basicSalary)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <p className="text-sm text-slate-300">Net Salary</p>
            <p className="mt-2 text-3xl font-semibold">
              {formatCurrency(payslip.netSalary)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
