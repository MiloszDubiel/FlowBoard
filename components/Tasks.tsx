"use client";

import {
  CheckSquare,
  CheckCircle2,
  FolderKanban,
  CalendarDays,
  ListTodo,
  Circle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
type Task = {
  name: string;
  isCompleted: boolean;
};

export default function Tasks({ cards }: any) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const totalTasks = cards.reduce(
    (sum: number, card: any) => sum + (card.tasks?.length ?? 0),
    0,
  );

  const completedTasksCount = cards.reduce(
    (sum: number, card: any) =>
      sum + (card.tasks?.filter((task: Task) => task.isCompleted).length ?? 0),
    0,
  );

  const filteredCards = cards.filter((card: any) => {
    const tasks = card.tasks ?? [];
    const completed = tasks.filter((task: Task) => task.isCompleted).length;

    if (activeFilter === "completed") {
      return tasks.length > 0 && completed === tasks.length;
    }

    if (activeFilter === "active") {
      return completed < tasks.length;
    }

    return true;
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moje zadania</h1>

        <p className="mt-2 text-muted-foreground">
          Wszystkie zadania z kart, do których jesteś przypisany.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <FolderKanban className="h-6 w-6 text-blue-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Przypisane karty</p>
              <p className="text-2xl font-bold">{cards.length}</p>
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
              <p className="text-2xl font-bold">{completedTasksCount}</p>
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
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Przypisane karty</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Śledź postęp i terminy swoich zadań.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
            >
              Wszystkie
            </Button>

            <Button
              size="sm"
              variant={activeFilter === "active" ? "default" : "outline"}
              onClick={() => setActiveFilter("active")}
            >
              W trakcie
            </Button>

            <Button
              size="sm"
              variant={activeFilter === "completed" ? "default" : "outline"}
              onClick={() => setActiveFilter("completed")}
            >
              Ukończone
            </Button>
          </div>
        </div>

        {cards.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <CheckSquare className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">Brak przypisanych zadań</h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Nie jesteś jeszcze przypisany do żadnej karty. Gdy ktoś
                przypisze Ci zadanie, pojawi się ono tutaj.
              </p>
            </CardContent>
          </Card>
        ) : filteredCards.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <ListTodo className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">
                Brak kart w tej kategorii
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Spróbuj wybrać inny filtr.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() => setActiveFilter("all")}
              >
                Pokaż wszystkie
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((card: any) => {
              const tasks = (card?.tasks ?? []) as Task[];

              const completed = tasks.filter((task) => task.isCompleted).length;

              const progress =
                tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

              const isCompleted =
                tasks.length > 0 && completed === tasks.length;

              return (
                <Card
                  key={card.id}
                  className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-2">
                        <CardTitle className="line-clamp-2 text-base">
                          <Link
                            href={`/projects/board/${card?.list?.boardId}`}
                            className="transition-colors hover:text-primary hover:underline"
                          >
                            {card.title}
                          </Link>
                        </CardTitle>

                        {card.list && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FolderKanban className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{card.list.name}</span>
                          </div>
                        )}
                      </div>

                      <Badge
                        variant="secondary"
                        className={
                          isCompleted
                            ? "shrink-0 bg-green-500/10 text-green-600 dark:text-green-400"
                            : "shrink-0 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }
                      >
                        {isCompleted ? "Ukończona" : "Aktywna"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Postęp</span>

                        <span className="font-semibold">
                          {Math.round(progress)}%
                        </span>
                      </div>

                      <Progress value={progress} className="h-2" />

                      <p className="text-xs text-muted-foreground">
                        {completed} z {tasks.length} zadań ukończonych
                      </p>
                    </div>

                    {tasks.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Brak zadań w tej karcie
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3"
                          >
                            {task.isCompleted ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            ) : (
                              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            )}

                            <span
                              className={`text-sm ${
                                task.isCompleted
                                  ? "text-muted-foreground line-through"
                                  : ""
                              }`}
                            >
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {card.dueDate && (
                      <div className="mt-auto flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0" />

                        <span>
                          Termin:{" "}
                          {new Date(card.dueDate).toLocaleDateString("pl-PL")}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
