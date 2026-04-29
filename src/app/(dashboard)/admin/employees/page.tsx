import { Metadata } from "next";
import EmployeeList from "@/components/lists/employee-list";
import { connectDB } from "@/lib/db";
import { IUser, User } from "@/models/user";
import { Department, IDepartment } from "@/models/department";

export const metadata: Metadata = {
  title: "Employees",
};

export default async function Employees() {
  await connectDB();

  const employees: IUser[] = await User.find({
    role: "EMPLOYEE",
    isDeleted: false,
  })
    .select("-password -refreshToken")
    .lean();

  const departments: IDepartment[] = await Department.find({
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Employees Directory
        </h1>
      </div>

      <EmployeeList
        employees={JSON.parse(JSON.stringify(employees))}
        departments={JSON.parse(JSON.stringify(departments))}
      />
    </div>
  );
}
