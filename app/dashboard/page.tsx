import {
  FolderKanban,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projects = [
  {
    id: 1,
    name: "FlowBoard",
    description: "Aplikacja do zarządzania projektami",
    color: "bg-blue-500",
    progress: 75,
    tasks: 24,
    completed: 18,
    members: 4,
  },
  {
    id: 2,
    name: "MyITStore",
    description: "Sklep internetowy",
    color: "bg-purple-500",
    progress: 50,
    tasks: 32,
    completed: 16,
    members: 3,
  },
  {
    id: 3,
    name: "Portfolio",
    description: "Moje portfolio developerskie",
    color: "bg-green-500",
    progress: 30,
    tasks: 10,
    completed: 3,
    members: 1,
  },
];

export default function DashboardPage() {
  return (
    <section className="min-h-screen w-full flex-1 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Moje projekty</h1>

            <p className="mt-1 text-muted-foreground">
              Zarządzaj swoimi projektami w jednym miejscu.
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nowy projekt
          </Button>
        </div>

        {/* Stats */}
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
                <p className="text-sm text-muted-foreground">
                  Ukończone zadania
                </p>

                <p className="text-2xl font-bold">
                  {projects.reduce(
                    (total, project) => total + project.completed,
                    0,
                  )}
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
                <p className="text-sm text-muted-foreground">
                  Wszystkie zadania
                </p>

                <p className="text-2xl font-bold">
                  {projects.reduce(
                    (total, project) => total + project.tasks,
                    0,
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
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
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${project.color} flex items-center justify-center text-white`}
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
                        <DropdownMenuItem>Otwórz projekt</DropdownMenuItem>

                        <DropdownMenuItem>Edytuj projekt</DropdownMenuItem>

                        <DropdownMenuItem className="text-destructive">
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

                      <span className="font-medium">{project.progress}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${project.color} transition-all`}
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />

                      <span>
                        {project.completed}/{project.tasks} zadań
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />

                      <span>{project.members}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <button
              type="button"
              className="flex min-h-57.5 flex-col items-center justify-center rounded-xl border border-dashed bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50 hover:text-foreground"
            >
              <div className="mb-3 rounded-full bg-muted p-3">
                <Plus className="h-5 w-5" />
              </div>

              <span className="font-medium">Utwórz nowy projekt</span>

              <span className="mt-1 text-sm">Zacznij nowy projekt</span>
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
