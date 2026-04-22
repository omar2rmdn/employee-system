"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/actions/auth";

const adminLinks = [
  { href: "/admin", label: "Home" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/attendance", label: "Attendance" },
  { href: "/admin/leave", label: "Leave" },
  { href: "/admin/payslips", label: "Payslips" },
  { href: "/admin/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-indigo-950 text-white w-64 flex flex-col h-full hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">Admin Portal</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-800 text-white font-semibold"
                  : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mb-4">
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
