import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard } from "@/lib/data/board";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { Card, List } from "@/generated/prisma/client";
export default async function BoardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  const board = await getBoard(Number(id), Number(user?.userID));
  const lists = board?.lists;

  console.log(board);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <div>
          <h1 className="text-lg font-semibold">{board?.name} </h1>

          <p className="text-sm text-muted-foreground">Tablica projektu</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            Członkowie
          </Button>

          <Button className="cursor-pointer">Dodaj kartę</Button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-x-auto bg-muted/40 p-6">
        <div className="flex h-full min-w-max gap-4">
          {lists?.map((column: any) => (
            <div
              key={column.id}
              className="flex w-80 flex-col rounded-lg bg-muted p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{column.name}</h3>

                <button className="rounded px-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  ⋯
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {column.cards.map((card: Card) => (
                  <div
                    key={card.id}
                    className="cursor-pointer rounded-md border bg-card p-3 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="text-sm font-medium">{card.title}</p>
                  </div>
                ))}
              </div>

              <button className="mt-3 rounded-md p-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                + Dodaj kartę
              </button>
            </div>
          ))}

          <button className="h-fit w-80 rounded-lg border bg-muted p-3 text-left text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            + Dodaj kolejną listę
          </button>
        </div>
      </div>
    </>
  );
}
