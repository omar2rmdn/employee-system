import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Department, IDepartment } from "@/models/department";
import { DepartmentManager } from "@/components/departments/department-manager";

export const metadata: Metadata = {
  title: "Departments",
};

export default async function DepartmentsPage() {
  await connectDB();

  const departments: IDepartment[] = await Department.find({
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage department options available to administrators when adding or
          editing employees.
        </p>
      </div>

      <DepartmentManager
        departments={JSON.parse(JSON.stringify(departments))}
      />
    </div>
  );
}
