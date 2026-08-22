"use client";

import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { SortableList } from "./SortableList";
import AddList from "./AddList";
import EditList from "./EditList";
import { List } from "@/generated/prisma/client";
import ConfirmModal from "../modals/ConfirmModal";
import { useList } from "@/mutations/dashboard/useList";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DragDropProvider } from "@dnd-kit/react";
import axios from "axios";
import { isSortable } from "@dnd-kit/react/sortable";
import { useMutation } from "@tanstack/react-query";

export default function Board({ columns, board }: any) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenEdit, setOpenEdit] = useState<boolean>(false);
  const [editedList, setEditedList] = useState<List>();
  const [deletedList, setDeleteList] = useState<boolean>(false);
  const {
    deleteList: { mutate },
  } = useList(editedList?.id);

  const route = useRouter();

  const { mutate: reorderLists, isPending } = useMutation({
    mutationKey: ["lists"],
    mutationFn: async (lists: any[]) => {
      const { data } = await axios.patch("/api/list/reorder", { lists });

      return data;
    },
  });

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
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return;

              const { source } = event.operation;

              if (isSortable(source)) {
                const { initialIndex, index } = source;

                if (initialIndex !== index) {
                  const newItems = [...board.lists];

                  const [removed] = newItems.splice(initialIndex, 1);
                  newItems.splice(index, 0, removed);

                  // Aktualizujemy position zgodnie z nową kolejnością
                  const updatedLists = newItems.map((list, index) => ({
                    ...list,
                    position: index,
                  }));
                  console.table(updatedLists);
                  reorderLists(updatedLists);
                }
              }
            }}
          >
            {board.lists?.map((column: any, index: number) => (
              <SortableList
                column={column}
                id={column.id}
                index={index}
                onEdit={(list: any) => {
                  setOpenEdit(true);
                  setEditedList(list);
                }}
                onDelete={(list: any) => {
                  setDeleteList(true);
                  setEditedList(list);
                }}
              />
            ))}
          </DragDropProvider>
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
      <EditList
        open={isOpenEdit}
        onOpenChange={setOpenEdit}
        boardID={board.id}
        list={editedList}
      />
      <ConfirmModal
        open={deletedList}
        onOpenChange={setDeleteList}
        title="Usunąć"
        message={`Czy na pewno chcesz usunąć listę o nazwie: ${editedList?.name} ?`}
        onSubmit={() => {
          mutate(undefined, {
            onSuccess: (data) => {
              route.refresh();
              toast.success(data.message);
            },
          });
          setDeleteList(false);
        }}
        onCancel={() => {
          setDeleteList(false);
        }}
      />
    </>
  );
}
