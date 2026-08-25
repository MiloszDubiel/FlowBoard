"use client";

import {
  FolderKanban,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  CheckCircle2,
  Clock3,
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
import { Project } from "@/types/project.type";
import EditProject from "./EditProject";
import ConfirmModal from "../modals/ConfirmModal";
import { useDashboard } from "@/mutations/dashboard/useDashboard";

import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const boardColorClasses: Record<string, string> = {
  ORANGE: "bg-orange-500",
  BLUE: "bg-blue-500",
  GREEN: "bg-green-500",
  RED: "bg-red-500",
  PURPLE: "bg-purple-500",
  PINK: "bg-pink-500",
};
const Projects = ({ projects }: any) => {
  const route = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | undefined>();

  const {
    deleteProject: { mutate },
  } = useDashboard(editedProject?.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moje projekty</h1>

          <p className="mt-1 text-muted-foreground">
            Zarządzaj swoimi projektami w jednym miejscu.
          </p>
        </div>

        <Button onClick={() => setOpen(true)} className="cursor-pointer ">
          <Plus className="mr-2 h-4 w-4" />
          Nowy projekt
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <FolderKanban className="h-5 w-5 text-blue-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Projekty</p>

              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-green-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Ukończone zadania</p>

              <p className="text-2xl font-bold">
                {/* {projects.reduce(
                  (total: number, project: Project) =>
                    total + project.completed,
                  0,
                )} */}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-orange-500/10 p-3">
              <Clock3 className="h-5 w-5 text-orange-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Wszystkie zadania</p>

              <p className="text-2xl font-bold">
                {/* {projects.reduce(
                  (total: number, project: Project) => total + project.tasks,
                  0,
                )} */}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Szukaj projektu..." className="pl-9" />
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projekty</h2>

          <span className="text-sm text-muted-foreground">
            {projects.length} projektów
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <Card
              key={project.id}
              className="group transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg ${boardColorClasses[project.color]} flex items-center justify-center text-white`}
                    >
                      <FolderKanban className="h-5 w-5" />
                    </div>

                    <div>
                      <CardTitle className="text-base">
                        {project.name}
                      </CardTitle>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    ></DropdownMenuTrigger>

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
                        className="text-destructive"
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
                <div className="mb-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Postęp</span>

                    {/* <span className="font-medium">{project.progress}%</span> */}
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${project.color} transition-all`}
                      style={
                        {
                          // width: `${project.progress}%`,
                        }
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />

                    <span>
                      {/* {project.completed}/{project.tasks} zadań */}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />

                    {/* <span>{project.members}</span> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <button
            type="button"
            className="flex min-h-57.5 flex-col items-center justify-center rounded-xl border border-dashed bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50 hover:text-foreground cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="mb-3 rounded-full bg-muted p-3">
              <Plus className="h-5 w-5" />
            </div>

            <span className="font-medium">Utwórz nowy projekt</span>

            <span className="mt-1 text-sm">Zacznij nowy projekt</span>
          </button>
        </div>
        <CreateProject open={open} onOpenChange={setOpen} />
        <EditProject
          open={openEdit}
          onOpenChange={setOpenEdit}
          project={editedProject}
        />
        <ConfirmModal
          open={openConfirm}
          title="Usunąć?"
          message={`Czy na pewno checsz usunąć projekt: ${editedProject?.name}?`}
          onOpenChange={setOpen}
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
      </section>
    </div>
  );
};
export default Projects;
