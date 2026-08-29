"use client";

// import { useDroppable } from "@dnd-kit/react";
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
import { CollisionPriority } from "@dnd-kit/abstract";

export const Column = ({ children, id, column, index }: any) => {
  const { ref, isDropTarget, handleRef } = useSortable({
    id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
  });

  return (
    <>
      <Card ref={ref} className="flex w-80 shrink-0 flex-col bg-muted">
        <CardHeader className="group flex flex-row items-center justify-between space-y-0 ">
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
              <DropdownMenuItem

              // onClick={() => onEdit(column)}
              >
                Edytuj listę
              </DropdownMenuItem>

              <DropdownMenuItem
                // onClick={() => onDelete(column)}
                className="text-destructive"
              >
                Usuń listę
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <h3 className="truncate font-semibold text-foreground">
            {column?.name}
          </h3>

          
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground active:cursor-grabbing group-hover:opacity-100"
              title="Przenieś listę"
              ref={handleRef}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent ref={ref}>
          <div className="min-h-32 space-y-2 rounded-md">{children}</div>

          <Button
            variant="ghost"
            className="mt-2 w-full cursor-pointer justify-start text-muted-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Dodaj kartę
          </Button>
        </CardContent>
      </Card>
      {/* <CreateCardModal
        open={createCardOpen}
        onOpenChange={setCreateCardOpen}
        listId={column.id}
        members={memebrs}
      /> */}
    </>
  );
};
