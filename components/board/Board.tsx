"use client";

import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SortableList } from "./SortableList";
import AddList from "./AddList";
import EditList from "./EditList";
import { BoardMember, List } from "@/generated/prisma/client";
import ConfirmModal from "../modals/ConfirmModal";
import { useList } from "@/mutations/dashboard/useList";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DragDropProvider } from "@dnd-kit/react";
import axios from "axios";
import { isSortable } from "@dnd-kit/react/sortable";
import { useMutation } from "@tanstack/react-query";
import BoardMembersModal from "./BoardMembers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Board({ columns, board, members }: any) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenEdit, setOpenEdit] = useState<boolean>(false);
  const [editedList, setEditedList] = useState<List>();
  const [deletedList, setDeleteList] = useState<boolean>(false);
  const [showMembers, setShowMembers] = useState<boolean>(false);
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
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{board?.name}</h1>

          <p className="text-sm text-muted-foreground">Tablica projektu</p>
        </div>

        <div className="flex items-center gap-2">
          {members.map((member: any) => (
            <div key={member.id} className="group relative">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {member.user.name
                    .split(" ")
                    .map((name: string) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="pointer-events-none absolute right-0 top-11 z-50 hidden w-max rounded-md bg-popover px-3 py-2 text-sm shadow-md group-hover:block">
                <p className="font-medium">{member.user.name}</p>

                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {member.role === "OWNER" ? "Właściciel" : "Członek"}
                </p>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="ml-2 cursor-pointer"
            onClick={() => setShowMembers(true)}
          >
            <Users className="mr-2 h-4 w-4" />
            Zarządzaj zespołem
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

                  const updatedLists = newItems.map((list, index) => ({
                    ...list,
                    position: index,
                  }));

                  reorderLists(updatedLists);
                }
              }
            }}
          >
            {board.lists?.map((column: any, index: number) => (
              <SortableList
                column={column}
                id={column.id}
                key={column.id}
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
      <BoardMembersModal
        open={showMembers}
        onOpenChange={setShowMembers}
        boardId={board.id}
        members={members}
      />
    </>
  );
}
