"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { IUser } from "@/models/user";
import { ChevronDown, Search } from "lucide-react";
import { AddEmployeeModal } from "../modals/add-employee";
import { EditEmployeeModal } from "../modals/edit-employee";
import { DeleteEmployeeModal } from "../modals/delete-employee";

interface Props {
  employees: IUser[];
  departments: Array<{
    _id: string;
    name: string;
  }>;
}

export default function EmployeeList({ employees, departments }: Props) {
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IUser | null>(null);

  const departmentFilters = useMemo(() => {
    return ["All", ...departments.map((department) => department.name)];
  }, [departments]);

  const departmentOptions = useMemo(() => {
    return departments.map((department) => department.name);
  }, [departments]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesDepartment =
        departmentFilter === "All" || e.department === departmentFilter;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        fullName.includes(normalizedQuery) ||
        e.email.toLowerCase().includes(normalizedQuery) ||
        e.position.toLowerCase().includes(normalizedQuery);

      return matchesDepartment && matchesSearch;
    });
  }, [employees, departmentFilter, searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-48 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm rounded-lg py-2.5 px-4 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <span className="truncate">
                {departmentFilter === "All"
                  ? "All Departments"
                  : departmentFilter}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-hidden">
                {departmentFilters.map((dep) => (
                  <button
                    key={dep}
                    onClick={() => {
                      setDepartmentFilter(dep);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      departmentFilter === dep
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {dep === "All" ? "All Departments" : dep}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg transition-colors font-medium shadow-sm"
          >
            Add Employee
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100">
              <th className="py-4 px-6 font-semibold">Name</th>
              <th className="py-4 px-6 font-semibold">Department</th>
              <th className="py-4 px-6 font-semibold">Position</th>
              <th className="py-4 px-6 font-semibold text-center">Status</th>
              <th className="py-4 px-6 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm divide-y divide-gray-100">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-gray-500">
                  No employees found in the directory.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee._id.toString()}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {employee.email}
                    </div>
                  </td>
                  <td className="py-3 px-6">{employee.department}</td>
                  <td className="py-3 px-6">{employee.position}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${
                        employee.employmentStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : employee.employmentStatus === "ON_LEAVE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.employmentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        departments={departmentOptions}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        departments={departmentOptions}
      />

      <DeleteEmployeeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
}
