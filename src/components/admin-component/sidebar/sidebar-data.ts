import {
  IconBrowserCheck,
  IconUserCode ,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconNotification,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { type SidebarData } from './types'

export const  sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Depatments',
          url: '/departments',
          icon: IconChecklist,
        },
        {
          title: 'Projects',
          url: '/project-admin',
          icon: IconPackages,
        },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'RBAC',
      items: [
        {
          title: 'RBAC',
          icon: IconLockAccess,
          items: [
            {
              title: 'Roles',
              url: '/roles',
            },
            {
              title: 'Permission',
              url: '/permissions',
            },
            {
              title: 'Roles-Permission',
              url: '/roles-permission',
            },
          ],
        },
        {
          title: 'Onboarding',
          icon: IconUserCode,
          items: [
            {
            title: 'Create-Onbording',
              url: '/create-onbording',
              icon: IconLock,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
