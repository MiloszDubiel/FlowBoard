"use client";

import {
  Calendar,
  CheckSquare,
  FolderKanban,
  HelpCircle,
  UserPlus,
  Plus,
  Settings,
  Users,
  LogOut,
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
import CreateProject from "./CreateProject";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/mutations/useLogout";

const mainItems = [
  {
    title: "Projekty",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Zadania",
    url: "/projects/tasks",
    icon: CheckSquare,
  },
  //DO IMPLEMENTACJI
  // {
  //   title: "Kalendarz",
  //   url: "/projects/calendar",
  //   icon: Calendar,
  // },
  // {
  //   title: "Zespół",
  //   url: "/projects/team",
  //   icon: Users,
  // },
  {
    title: "Zaproszenia",
    url: "/projects/invits",
    icon: UserPlus,
  },
];

const secondaryItems = [
  {
    title: "Ustawienia",
    url: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar({ projects = [] }: any) {
  const { user } = useUser();

  const {
    logout: { mutate: logout },
  } = useLogout();

  const [open, setOpen] = useState(false);

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
          <div className="flex items-center justify-between bg-or">
            <SidebarGroupLabel>Projekty</SidebarGroupLabel>

            <SidebarMenuButton
              className="size-7 flex justify-center items-center cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Plus />
            </SidebarMenuButton>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((el: any) => {
                return (
                  <SidebarMenuItem key={el.id}>
                    <SidebarMenuButton>
                      <a href={`/projects/board/${el?.boards?.[0].id}`}>
                        <span className="size-2 rounded-full bg-blue-500" />
                        <span>{el.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="flex  items-center gap-4 cursor-pointer"
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogOut />
                  <span>Wyloguj</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
            <p className="truncate text-sm font-medium">{user?.name}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
      <CreateProject open={open} onOpenChange={setOpen} />
    </Sidebar>
  );
}
