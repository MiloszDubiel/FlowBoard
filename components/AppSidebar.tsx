"use client";

import {
  Calendar,
  CheckSquare,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projekty",
    url: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Zadania",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Kalendarz",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Zespół",
    url: "/dashboard/team",
    icon: Users,
  },
];

const secondaryItems = [
  {
    title: "Ustawienia",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Pomoc",
    url: "/dashboard/help",
    icon: HelpCircle,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FolderKanban className="size-4" />
          </div>

          <span className="text-lg font-semibold">FlowBoard</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a
                      href={item.url}
                      className="flex justify-center items-center gap-4"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Projekty</SidebarGroupLabel>

            <SidebarMenuButton className="size-7">
              <Plus />
            </SidebarMenuButton>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/dashboard/projects/flowboard">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span>FlowBoard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/dashboard/projects/myitstore">
                    <span className="size-2 rounded-full bg-green-500" />
                    <span>MyITStore</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a
                      href={item.url}
                      className="flex justify-center items-center gap-4"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            M
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Miłosz</p>

            <p className="truncate text-xs text-muted-foreground">
              milosz@example.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
