import { LayoutDashboard, Settings, Users, Shield, ClipboardList, Archive } from "lucide-react"

import { MainNav } from "@/components/main-nav"
import type { SidebarNavItem } from "@/components/sidebar-nav"

interface SidebarProps {
  items: SidebarNavItem[]
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <div className="flex flex-col space-y-6 w-64">
      <MainNav className="flex-1" />
      <div className="space-y-1">
        <h4 className="mb-2 ml-4 text-sm font-semibold">Admin</h4>
        <ul className="flex flex-col space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Roles",
    href: "/admin/roles",
    icon: Shield,
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ClipboardList,
  },
  {
    name: "Audit Settings",
    href: "/admin/audit-settings",
    icon: Archive,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]
