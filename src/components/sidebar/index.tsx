import { logoutUser, getCurrentUser } from "@/actions/auth";
import { SideLink } from "./side-link";
import { UserIcon, CircleUser } from "lucide-react";

interface Props {
  links: {
    href: string;
    label: string;
  }[];
}

export async function Sidebar({ links }: Props) {
  const user = await getCurrentUser();

  return (
    <aside className="bg-blue-950 text-white w-80 lg:flex flex-col h-full hidden md:flex">
      {/* Header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <UserIcon className="text-white size-7" />
          <div>
            <p className="font-semibold text-[13px] text-white tracking-wide">
              Employee MS
            </p>
            <p className="text-[11px] text-blue-300/70 font-medium">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="m-4 bg-blue-900/50 border border-white/10 rounded-lg p-3 flex items-center gap-3">
          <p className="bg-indigo-800 px-5 py-3 rounded-lg text-lg">
            {user.name[0].toUpperCase()}
          </p>
          <div>
            <p className="text-sm font-semibold text-white line-clamp-1">
              {user.name}
            </p>
            <p className="text-xs text-blue-300 capitalize">{user.role}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        <h1 className="text-blue-300/50 text-sm font-medium mb-3 px-2">
          Navigation
        </h1>
        {links.map((link) => (
          <SideLink key={link.href} {...link} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-auto">
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
