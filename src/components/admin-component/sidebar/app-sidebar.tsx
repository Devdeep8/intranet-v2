"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { sidebarData } from './sidebar-data'
import { User } from 'next-auth'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User
}

export function AppSidebar({ user,...props }: AppSidebarProps) {
  return (

    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Admin Panel</h1>

        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
