import { Sidebar } from "@/components/sidebar";
import { adminLinks } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Dashboard",
    default: "Admin Dashboard",
  },
  description: "Comprehensive management dashboard for administrators to oversee operations, manage users, and monitor system metrics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar links={adminLinks} />
      <main className="flex-1 overflow-y-auto p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto">
        {children}
      </main>
    </div>
  );
}
