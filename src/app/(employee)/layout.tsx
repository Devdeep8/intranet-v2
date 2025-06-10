// components/AdminLayout.tsx
import { AppSidebar } from "@/components/employee-component/empolyee-sidebar/empolyee-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireUser } from "@/utils/requireUser";
import React from "react";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawUser = await requireUser();
  const user = { ...rawUser, id: rawUser.user_id };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar user={user} />
        <SidebarTrigger />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
