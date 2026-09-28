"use client";

import {
  Plus,
  Search,
  FolderKanban,
  CheckCircle2,
  ListTodo,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateProject from "./CreateProject";
import { Badge } from "../ui/badge";
import EditProject from "./EditProject";
import ConfirmModal from "../modals/ConfirmModal";
import { useDashboard } from "@/mutations/dashboard/useDashboard";

import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Progress } from "../ui/progress";
import { colorRecord } from "@/lib/colors";

const Projects = ({ projects, children, taskState }: any) => {
  const route = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedProject, setEditedProject] = useState<any | undefined>();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "completed"
          ? project.progress === 100
          : project.progress < 100;

    return matchesSearch && matchesFilter;
  });

  const {
    deleteProject: { mutate },
  } = useDashboard(editedProject?.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moje projekty</h1>

          <p className="mt-2 text-muted-foreground">
            Zarządzaj swoimi projektami i śledź postępy pracy.
          </p>
        </div>

        <Button onClick={() => setOpen(true)} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Nowy projekt
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <FolderKanban className="h-6 w-6 text-blue-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Wszystkie projekty
              </p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Ukończone zadania</p>
              <p className="text-2xl font-bold">{taskState?.doneTasks ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <ListTodo className="h-6 w-6 text-orange-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Wszystkie zadania</p>
              <p className="text-2xl font-bold">{taskState?.allTasks ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wyszukiwanie i filtry */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Szukaj projektu..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              Wszystkie
            </Button>

            <Button
              variant={activeFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("active")}
            >
              Aktywne
            </Button>

            <Button
              variant={activeFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("completed")}
            >
              Ukończone
            </Button>
          </div>
        </div>
      </div>

      {/* Lista projektów */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Twoje projekty</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Przeglądaj i zarządzaj swoimi projektami.
            </p>
          </div>

          <span className="text-sm text-muted-foreground">
            {filteredProjects.length} projektów
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <FolderKanban className="h-8 w-8 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">
                {projects.length === 0
                  ? "Nie masz jeszcze żadnych projektów"
                  : "Nie znaleziono projektów"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {projects.length === 0
                  ? "Utwórz swój pierwszy projekt i zacznij organizować zadania."
                  : "Spróbuj zmienić wyszukiwaną frazę lub wybrany filtr."}
              </p>

              {projects.length === 0 ? (
                <Button className="mt-5" onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Utwórz projekt
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                >
                  Wyczyść filtry
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project: any) => {
              const color = project.color;
              const isCompleted = project.progress === 100;

              return (
                <Card
                  key={project.id}
                  className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `${colorRecord[color]}22`,
                            color: colorRecord[color],
                          }}
                        >
                          <FolderKanban className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <CardTitle className="truncate text-base">
                            <Link
                              href={`/projects/board/${project.id}`}
                              className="transition-colors hover:text-primary hover:underline"
                            >
                              {project.name}
                            </Link>
                          </CardTitle>

                          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                            {project.description || "Brak opisu projektu"}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          }
                        />

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/projects/board/${project.id}`}>
                        
                              Otwórz projekt
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setEditedProject(project);
                              setOpenEdit(true);
                            }}
                          >
                           
                            Edytuj projekt
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setEditedProject(project);
                              setOpenConfirm(true);
                            }}
                          >
                    
                            Usuń projekt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                      <Badge
                        variant={isCompleted ? "default" : "secondary"}
                        className={
                          isCompleted
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/10 dark:text-green-400"
                            : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
                        }
                      >
                        {isCompleted ? "Ukończony" : "Aktywny"}
                      </Badge>

                      <span className="text-sm font-semibold">
                        {project.progress}%
                      </span>
                    </div>

                    <div className="mb-5">
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />

                        <span>
                          {project.completed}/{project.tasks} zadań
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />

                        <span>{project.members}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <button
              type="button"
              className="flex min-h-57.5 flex-col items-center justify-center rounded-xl border border-dashed bg-background p-6 text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50 hover:text-foreground"
              onClick={() => setOpen(true)}
            >
              <div className="mb-4 rounded-full bg-muted p-4">
                <Plus className="h-6 w-6" />
              </div>

              <span className="font-semibold">Utwórz nowy projekt</span>

              <span className="mt-2 text-sm">Zacznij nowy projekt</span>
            </button>
          </div>
        )}
      </section>

      <CreateProject open={open} onOpenChange={setOpen} />

      <EditProject
        open={openEdit}
        onOpenChange={setOpenEdit}
        project={editedProject}
      />

      <ConfirmModal
        open={openConfirm}
        title="Usunąć projekt?"
        message={`Czy na pewno chcesz usunąć projekt: ${editedProject?.name}?`}
        onOpenChange={setOpenConfirm}
        onSubmit={() => {
          mutate(undefined, {
            onSuccess: (data) => {
              route.refresh();
              toast.success(data.message);
            },
          });

          setOpenConfirm(false);
        }}
        onCancel={() => {
          setOpenConfirm(false);
        }}
      />
    </div>
  );
};
export default Projects;
