"use client";

import CreateCardModal from "./AddCard";
import { MoreHorizontal, Plus, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { useSortable } from "@dnd-kit/react/sortable";
import { useState } from "react";

export const Column = ({
  id,
  cards,
  column,
  onEdit,
  onDelete,
  members,
  projectId,
}: any) => {
  const { ref, handleRef } = useSortable({
    id,
    type: "column",
    index: id,
  });
  const [createCardOpen, setCreateCardOpen] = useState(false);

  return (
    <>
      <Card
        key={column.id}
        className="flex h-max-150 w-80 shrink-0 flex-col bg-muted"
        ref={ref}
      >
        <CardHeader className="group flex flex-row items-center justify-between space-y-0">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              ref={handleRef}
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground active:cursor-grabbing group-hover:opacity-100"
              title="Przenieś listę"
            >
              <GripVertical className="h-4 w-4" />
            </Button>

            <h3 className="truncate font-semibold text-foreground">
              {column.name}
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(column)}>
                Edytuj listę
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete(column)}
                className="text-destructive"
              >
                Usuń listę
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2 pt-0">
          <Button
            variant="ghost"
            className="cursor-pointer justify-start text-muted-foreground hover:text-accent-foreground"
            onClick={() => setCreateCardOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Dodaj kartę
          </Button>

          {cards.map((card: any, index: number) => (
            <TaskCard
              key={card.id}
              card={card}
              projectId={projectId}
              index={index}
              column={id}
            />
          ))}
        </CardContent>
      </Card>
      <CreateCardModal
        open={createCardOpen}
        onOpenChange={setCreateCardOpen}
        listId={column.id}
        members={members}
      />
    </>
  );
};
