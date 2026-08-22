"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import { MoreHorizontal, Plus, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Card as CardType, List } from "@/generated/prisma/client";
import { SortableCard } from "./SortableCarts";
import { useRef, useState } from "react";

export const SortableList = ({
  id,
  index,
  column,
  onEdit,
  onDelete,
}: {
  id: number;
  index: number;
  column: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({
    id,
    index,
    element,
    handle: handleRef,
  });

  return (
    <Card
      key={column.id}
      className="flex w-80 shrink-0 flex-col bg-muted"
      data-shadow={isDragging || undefined}
      ref={setElement}
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

      <CardContent className="flex flex-col gap-2 p-0 pt-0">
        {column.cards.map((card: CardType, index: number) => (
          <SortableCard key={card.id} id={card.id} index={index} card={card} />
        ))}

        <Button
          variant="ghost"
          className="cursor-pointer justify-start text-muted-foreground hover:text-accent-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Dodaj kartę
        </Button>
      </CardContent>
    </Card>
  );
};
