"use client";

import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Column } from "./Column";
import AddList from "./AddList";
import EditList from "./EditList";
import ConfirmModal from "../modals/ConfirmModal";
import { useList } from "@/mutations/dashboard/useList";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import BoardMembersModal from "./BoardMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { TaskCard } from "./TaskCard";
import { useUser } from "@/hooks/useUser";
import { type MembershipRole, ROLES } from "@/lib/roles";

export default function Board({ board, members }: any) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenEdit, setOpenEdit] = useState<boolean>(false);
  const [editedList, setEditedList] = useState<any>();
  const [deletedList, setDeleteList] = useState<boolean>(false);
  const [showMembers, setShowMembers] = useState<boolean>(false);
  const {
    deleteList: { mutate },
  } = useList(editedList?.id);

  const route = useRouter();
  const { user } = useUser();

  const lists = [...board.lists].sort(
    (a: any, b: any) => a.position - b.position,
  );

  const role = user?.memberships.find(
    (el: any) => Number(el.boardId) === Number(board.id),
  )?.role;

  const [items, setItems] = useState<any>(() =>
    Object.fromEntries(lists.map((list: any) => [String(list.id), list.cards])),
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    lists.map((list: any) => String(list.id)),
  );
  const columnOrderRef = useRef(columnOrder);

  const { mutate: reorderLists } = useMutation({
    mutationKey: ["lists", "reorder"],
    mutationFn: async (columnOrder: string[]) => {
      const { data } = await axios.patch("/api/list/reorder", {
        columnOrder,
        boardId: board.id,
      });

      return data;
    },
  });

  const me = useMemo(
    () => members.find((el: any) => el.userId == user?.id),
    [user],
  );

  const { mutate: switchList } = useMutation({
    mutationKey: ["card", "switch"],
    mutationFn: async (cards: string[]) => {
      const { data } = await axios.patch("/api/card/switch", {
        cards,
      });

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
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={member.user.avatarUrl ?? undefined} />

                <AvatarFallback>
                  {member.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="pointer-events-none absolute right-0 top-11 z-50 hidden w-max rounded-md bg-popover px-3 py-2 text-sm shadow-md group-hover:block">
                <p className="font-medium">{member.user.name}</p>

                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {ROLES[member.role as MembershipRole]}
                </p>
              </div>
            </div>
          ))}

          {["OWNER", "ADMIN"].includes(me?.role) && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2 cursor-pointer"
              onClick={() => setShowMembers(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Zarządzaj zespołem
            </Button>
          )}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-x-auto bg-muted/40 p-6">
        <div className="flex min-w-max items-start gap-4">
          <DragDropProvider
            onDragOver={(event) => {
              const { source } = event.operation;

              if (source?.type === "column") {
                setColumnOrder((columns) => {
                  const newOrder = move(columns, event);
                  columnOrderRef.current = newOrder;
                  return newOrder;
                });
                return;
              }

              setItems((items: any) => move(items, event));
            }}
            onDragEnd={(event) => {
              const { source } = event.operation;

              if (event.canceled || source?.type == "item") {
                switchList(items);
              }
              if (event.canceled || source?.type !== "column") return;

              reorderLists(columnOrderRef.current);
            }}
          >
            <div className="flex items-start gap-4">
              {columnOrder.map((column, columnIndex) => {
                const currentList = lists.find(
                  (list: any) => String(list.id) === column,
                );
                return (
                  <Column
                    key={column}
                    id={column}
                    column={currentList}
                    index={columnIndex}
                    members={members}
                    role={role}
                  >
                    {items[column].map((card: any, index: number) => (
                      <TaskCard
                        key={card.id}
                        id={card.id}
                        index={index}
                        column={column}
                        card={card}
                        role={role}
                      />
                    ))}
                  </Column>
                );
              })}
            </div>
          </DragDropProvider>

          <Button
            variant="outline"
            className="w-80 shrink-0 cursor-pointer justify-start"
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
