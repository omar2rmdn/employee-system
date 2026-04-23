"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  label: string;
}

export function SideLink({ href, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-800 text-white font-semibold"
          : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full transition-colors ${
          isActive ? "bg-white" : "bg-transparent"
        }`}
      />
      {label}
    </Link>
  );
}
