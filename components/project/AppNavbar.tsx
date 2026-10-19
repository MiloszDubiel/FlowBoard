"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckSquare,
  UserPlus,
  Settings,
  Plus,
  LogOut,
  Menu,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/mutations/useLogout";

import CreateProject from "./CreateProject";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

type AppNavbarProps = {
  projects?: any[];
};

const AppNavbar = ({ projects = [] }: AppNavbarProps) => {
  const { user } = useUser();

  const {
    logout: { mutate: logout },
  } = useLogout();

  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="mx-auto flex h-16 w-full items-center gap-4 px-4 md:px-6 ">
        <Link href="/projects" className="flex shrink-0 items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FolderKanban className="size-5" />
          </div>

          <span className="hidden text-lg font-semibold sm:inline">
            FlowBoard
          </span>
        </Link>

        <div className="min-w-0 flex-1 items-center gap-1 hidden md:flex">
          {mainItems.map((item) => (
            <Button key={item.title} variant="ghost" className="gap-2">
              <Link href={item.url}>
                <item.icon className="size-4" />
                {item.title}
              </Link>
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="gap-2">
                <LayoutGrid className="size-4" />
                Moje projekty
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="flex items-center justify-between">
                Projekty
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setCreateProjectOpen(true)}
                  aria-label="Utwórz projekt"
                >
                  <Plus className="size-4" />
                </Button>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {projects.length > 0 ? (
                projects.map((project) => {
                  const boardId = project.boards?.[0]?.id;

                  return (
                    <DropdownMenuItem key={project.id} disabled={!boardId}>
                      {boardId ? (
                        <Link href={`/projects/board/${boardId}`}>
                          <span className="size-2 shrink-0 rounded-full bg-blue-500" />
                          <span className="truncate">{project.name}</span>
                        </Link>
                      ) : (
                        <span>{project.name}</span>
                      )}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <DropdownMenuItem disabled>Brak projektów</DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => setCreateProjectOpen(true)}>
                <Plus className="size-4" />
                Utwórz projekt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {secondaryItems.map((item) => (
            <Button key={item.title} variant="ghost" size="icon">
              <Link href={item.url} aria-label={item.title}>
                <item.icon className="size-5" />
              </Link>
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="flex h-auto items-center gap-2 px-2 py-1"
              >
                <Avatar className="size-9">
                  <AvatarImage
                    src={user?.avatarUrl ?? ""}
                    alt={user?.email ?? "Zdjęcie profilowe"}
                  />
                  <AvatarFallback>
                    {user?.email?.slice(0, 2).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden max-w-36 text-left xl:block">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>

                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p>{user?.name}</p>
                <p className="font-normal text-muted-foreground">
                  {user?.email}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link href="/settings">
                  <Settings className="size-10" />
                  Ustawienia
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => logout()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="size-4" />
                Wyloguj
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto md:hidden absolute">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger>
              <Button variant="outline" size="icon" aria-label="Otwórz menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-80 flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FolderKanban className="size-5" />
                  FlowBoard
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-4">
                <div className="space-y-1">
                  <p className="px-3 pb-2 text-xs font-medium text-muted-foreground">
                    Workspace
                  </p>

                  {mainItems.map((item) => (
                    <Button
                      key={item.title}
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={closeMobileMenu}
                    >
                      <Link href={item.url} className="flex gap-2 items-center">
                        <item.icon className="size-4" />
                        {item.title}
                      </Link>
                    </Button>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3 pb-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Projekty
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 flex"
                      aria-label="Utwórz projekt"
                      onClick={() => {
                        closeMobileMenu();
                        setCreateProjectOpen(true);
                      }}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  {projects.map((project) => {
                    const boardId = project.boards?.[0]?.id;

                    return (
                      <Button
                        key={project.id}
                        variant="ghost"
                        disabled={!boardId}
                        className="w-full justify-start gap-3 "
                        onClick={closeMobileMenu}
                      >
                        {boardId ? (
                          <Link href={`/projects/board/${boardId}`}>
                            <span className="size-2 shrink-0 rounded-full bg-blue-500" />
                            <span className="truncate">{project.name}</span>
                          </Link>
                        ) : (
                          <span>{project.name}</span>
                        )}
                      </Button>
                    );
                  })}
                </div>

                <div className="space-y-1"></div>
              </div>

              <div className="space-y-3 p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => logout()}
                >
                  <LogOut className="size-4" />
                  Wyloguj
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={closeMobileMenu}
                >
                  <Link href="/settings" className="flex gap-2 items-center">
                    <Settings className="size-4" />
                    Ustawienia
                  </Link>
                </Button>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar className="size-9">
                    <AvatarImage
                      src={user?.avatarUrl ?? ""}
                      alt={user?.email ?? "Zdjęcie profilowe"}
                      className="object-cover"
                    />

                    <AvatarFallback>
                      {user?.email?.slice(0, 2).toUpperCase() ?? ""}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user?.name}</p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <CreateProject
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
      />
    </>
  );
};

export default AppNavbar;
