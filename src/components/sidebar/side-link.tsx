"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  href: string;
  label: string;
  icon: ReactNode;
}

export function SideLink({ href, label, icon }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "border border-slate-700 bg-slate-800 text-white font-semibold shadow-sm"
          : "border border-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-800/80 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
