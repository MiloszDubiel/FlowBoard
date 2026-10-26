import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Settings,
  Plus,
  LogOut,
  CheckSquare,
  UserPlus,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { Project } from "@/types/project.type";
import { useLogout } from "@/mutations/useLogout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";


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

type Props = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (_: boolean) => void;
  closeMobileMenu: () => void;
  setCreateProjectOpen: (_: boolean) => void;
  projects: Project[];
};

export const SideBarSheet = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  closeMobileMenu,
  setCreateProjectOpen,
  projects,
}: Props) => {
  const {
    logout: { mutate: logout },
  } = useLogout();

  const { user } = useUser();

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Otwórz menu">
            <Menu className="size-5" />
          </Button>
        }
      ></SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col">
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

            {projects.map((project: any) => {
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
  );
};
