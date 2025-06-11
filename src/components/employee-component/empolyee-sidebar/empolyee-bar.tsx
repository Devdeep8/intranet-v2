// AppSidebar.tsx
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from "../../admin-component/sidebar/nav-group"
import { NavUser } from '../../admin-component/sidebar/nav-user'
import { getSidebarData } from './sidebar-data'
import { User } from 'next-auth'

type AppSidebarProps = {
  user: User
  department?: { id: string; name: string } | undefined | null
}

export function AppSidebar({ user, department }: AppSidebarProps) {
  const sidebarData = getSidebarData(department);


  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Employee Panel</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}