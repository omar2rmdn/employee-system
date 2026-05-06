import {
  Home,
  Users,
  CalendarDays,
  FileText,
  DollarSign,
  Settings,
  Building2,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Home", icon: Home },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/leave", label: "Leave", icon: FileText },
  { href: "/admin/payslips", label: "Payslips", icon: DollarSign },
];

const employeeLinks = [
  { href: "/employee", label: "Home", icon: Home },
  { href: "/employee/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/employee/leave", label: "Leave", icon: FileText },
  { href: "/employee/payslips", label: "Payslips", icon: DollarSign },
];

export { adminLinks, employeeLinks };
