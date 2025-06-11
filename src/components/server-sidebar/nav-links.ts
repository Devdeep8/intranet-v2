
import {
  BarChart3,
  Bell,
  FileText,
  FolderTree,
  Home,
  Users,
} from "lucide-react";



export const navLinks = [
  {
    label: "My Workspace",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Home },
      { title: "My Tasks", href: "/tasks", icon: FileText },
      { title: "Projects", href: "/projects", icon: FolderTree },
      { title: "My Department", href: "/departments", icon: Users },
    ],
  },
  
  {
    label: "Personal",
    items: [
      { title: "Notifications", href: "/notifications", icon: Bell },
      { title: "Activity Logs", href: "/activity", icon: BarChart3 },
    ],
  },
];