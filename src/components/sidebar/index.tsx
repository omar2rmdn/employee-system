import { logoutUser, getCurrentUser } from "@/actions/auth";
import { SideLink } from "./side-link";
import { UserIcon, LucideIcon } from "lucide-react";

interface Props {
  links: {
    href: string;
    label: string;
    icon: LucideIcon;
  }[];
}

export async function Sidebar({ links }: Props) {
  const user = await getCurrentUser();

  return (
    <aside className="hidden h-full w-80 flex-col border-r border-slate-800 bg-slate-900 text-white md:flex lg:flex">
      {/* Header */}
      <div className="border-b border-slate-800 px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-slate-800 text-slate-100 ring-1 ring-slate-700">
            <UserIcon className="size-6" />
          </div>
          <div>
            <p className="font-semibold text-[13px] text-white tracking-wide">
              Employee MS
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="m-4 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/70 p-3 shadow-sm">
          <p className="rounded-lg bg-slate-700 px-5 py-3 text-lg font-semibold text-slate-100 ring-1 ring-slate-600">
            {user.firstName[0].toUpperCase()}
          </p>
          <div>
            <p className="text-sm font-semibold text-white line-clamp-1">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs capitalize text-slate-400">{user.role}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        <h1 className="mb-3 px-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Navigation
        </h1>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <SideLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={<Icon className="w-5 h-5" />}
            />
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-slate-100 transition-colors hover:border-slate-600 hover:bg-slate-700"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
