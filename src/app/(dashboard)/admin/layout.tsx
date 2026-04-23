import { Sidebar } from "@/components/sidebar";
import { adminLinks } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
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
