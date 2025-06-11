
// sidebar-data.ts
import {
  IconLayoutDashboard,
  IconChecklist,
  IconPackages,
  IconUsers,
  IconSettings,
  IconUserCog,
  IconTool,
  IconPalette,
  IconNotification,
  IconBrowserCheck,
  IconHelp,
  IconUserCode,
} from '@tabler/icons-react';
import { type SidebarData } from '../../admin-component/sidebar/types';

export const getSidebarData = (department?: { id: string; name: string } | null): SidebarData => {
  const generalItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconLayoutDashboard,
    },
    {
      title: 'Team',
      url: '/team',
      icon: IconUsers,
    },
  ];

  if (department?.id && department?.name) {
    generalItems.push({
      title: department.name,
      url: `/department/${department.id}`,
      icon: IconUsers,
    });
  }

  const sidebarData: SidebarData = {
    navGroups: [
      {
        title: 'General',
        items: generalItems,
      },
      {
        title: 'Settings',
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
        ],
      },
      {
        title: 'Support',
        items: [
          {
            title: 'Help Center',
            url: '/help-center',
            icon: IconHelp,
          },
        ],
      },
      {
        title: 'Employee',
        items: [
          {
            title: 'Employee',
            icon: IconUserCode,
            items: [
              {
                title: 'My Tasks',
                url: '/employee/tasks',
                icon: IconUserCode,
              },
              {
                title: 'Leave Requests',
                url: '/employee/leave-requests',
                icon: IconChecklist,
              },
              {
                title: 'Training',
                url: '/employee/training',
                icon: IconPackages,
              },
            ],
          },
        ],
      },
    ],
  };

  return sidebarData;
};