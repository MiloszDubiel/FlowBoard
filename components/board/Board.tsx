"use client";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { Card as CardType, List } from "@/generated/prisma/client";
import { useState } from "react";
import AddList from "./AddList";
import { MoreHorizontal, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Board({ columns, board }: any) {
  const lists = board.lists;
  const [isOpen, setOpen] = useState<boolean>(false);

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
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-x-auto bg-muted/40 p-6">
        <div className="flex h-full min-w-max gap-4">
          {lists?.map((column: any) => (
            <Card
              key={column.id}
              className="flex w-80 shrink-0 flex-col bg-muted"
            >
              <CardHeader className="group flex flex-row items-center justify-between space-y-0 ">
                <h3 className="font-semibold text-foreground">{column.name}</h3>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edytuj listę</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Usuń listę
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="flex flex-col gap-2 p-0 pt-0">
                {column.cards.map((card: CardType) => (
                  <Card
                    key={card.id}
                    className="cursor-pointer bg-card transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-3">
                      <p className="text-sm font-medium text-card-foreground">
                        {card.title}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="ghost"
                  className="justify-start text-muted-foreground hover:text-accent-foreground cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj kartę
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className=" w-80 shrink-0 justify-start cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Dodaj listę
          </Button>
        </div>
      </div>
      <AddList open={isOpen} onOpenChange={setOpen} boardID={board.id} />
    </>
  );
}
