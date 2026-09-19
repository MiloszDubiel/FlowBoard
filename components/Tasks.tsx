import { CheckSquare, CalendarDays, FolderKanban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
type Task = {
  name: string;
  isCompleted: boolean;
};

export default function Tasks({ cards }: any) {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moje zadania</h1>

        <p className="text-sm text-muted-foreground">
          Zadania z kart, do których jesteś przypisany.
        </p>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">Brak przypisanych zadań</h2>

            <p className="text-sm text-muted-foreground">
              Nie jesteś jeszcze przypisany do żadnej karty.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card: any) => {
            const tasks = (card.tasks ?? []) as Task[];

            const completedTasks = tasks.filter(
              (task) => task.isCompleted,
            ).length;

            const progress =
              tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

            return (
              <Card key={card.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        <Link href={`/projects/board/${card?.list?.boardId}`}>
                          {card.title}
                        </Link>
                      </CardTitle>

                      {card.list && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FolderKanban className="h-3.5 w-3.5" />
                          {card.list.name}
                        </div>
                      )}
                    </div>

                    <Badge variant="secondary">
                      {completedTasks}/{tasks.length}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Progress */}
                  {tasks.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Postęp</span>
                        <span>{Math.round(progress)}%</span>
                      </div>

                      <Progress value={progress} />
                    </div>
                  )}

                  {/* Tasks */}
                  {tasks.length === 0 ? (
                    <div className="rounded-md border border-dashed p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Brak zadań w tej karcie
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-md border p-3"
                        >
                          <CheckSquare
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              task.isCompleted
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />

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

                  {/* Due date */}
                  {card.dueDate && (
                    <div className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />

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
    </div>
  );
}
