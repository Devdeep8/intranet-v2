// components/AdminLayout.tsx
import { AppSidebar } from "@/components/admin-component/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "@/utils/requireUser";
import React from "react";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const rawUser = await requireUser()
  const user = { ...rawUser, id: rawUser.user_id }
  return (
    <SidebarProvider>

    <div className="flex h-screen">
      {/* Sidebar */}
      <AppSidebar user={user}/>
      {/* Main Content Area */}
      <div className="flex-1">

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
    </SidebarProvider>
  );
}
