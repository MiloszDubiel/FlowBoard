"use client";

import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Column } from "./Column";
import AddList from "./AddList";
import EditList from "./EditList";
import ConfirmModal from "../modals/ConfirmModal";
import { useList } from "@/mutations/dashboard/useList";
import { useCardStore } from "@/stores/card.store";
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import BoardMembersModal from "./BoardMembers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { useDashboard } from "@/mutations/dashboard/useDashboard";
import { useRouter } from "next/navigation";

export default function Board({ board, members }: any) {
  const [isOpenAdd, setOpenAdd] = useState<boolean>(false);
  const [isOpenEdit, setOpenEdit] = useState<boolean>(false);
  const [list, setList] = useState<any>();
  const [isOpenDelete, setOpenDelete] = useState<boolean>(false);
  const [showMembers, setShowMembers] = useState<boolean>(false);
  const {
    deleteList: { mutate },
  } = useList();

  const [listOrder, setListOrder] = useState<number[]>(() =>
    board.lists
      .sort((a: any, b: any) => a.position - b.position)
      .map((list: any) => list.id),
  );

  const [initialLists, _] = useState<Record<number, any[]>>(() =>
    Object.fromEntries(board.lists.map((list: any) => [list.id, list.cards])),
  );
  const [lists, setLists] = useState<Record<number, any[]>>(() =>
    Object.fromEntries(board.lists.map((list: any) => [list.id, list.cards])),
  );

  const { switchColumns, reorderLists } = useDashboard();

  const route = useRouter();

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
            onDragOver={(event: any) => {
              const { source, target } = event.operation;

              if (!source) return;
              if (source.type === "column") {
                setListOrder((items) => move(items, event));
                return;
              }
              if (
                source?.type === target?.type &&
                target?.type === "column" &&
                source?.type === "column"
              )
                return;

              setLists((items) => move(items, event));
            }}
            onDragEnd={() => {
              if (JSON.stringify(initialLists) !== JSON.stringify(lists)) {
                switchColumns(lists);
              }
              reorderLists(listOrder);
            }}
          >
            <div className="flex gap-4">
              {board.lists.map((list: any) => (
                <Column
                  column={list}
                  key={list.id}
                  id={list.id}
                  projectId={board.projectId}
                  cards={lists[list.id] ?? []}
                  onDelete={(list: any) => {
                    setOpenDelete(true);
                    setList(list);
                  }}
                  members={members}
                  onEdit={() => {
                    setOpenEdit(true);
                    setList(list);
                  }}
                />
              ))}
            </div>
          </DragDropProvider>

          <Button
            variant="outline"
            className=" w-80 shrink-0 justify-start cursor-pointer"
            onClick={() => setOpenAdd(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Dodaj listę
          </Button>
        </div>
      </div>
      <AddList open={isOpenAdd} onOpenChange={setOpenAdd} boardID={board.id} />
      <EditList
        open={isOpenEdit}
        onOpenChange={setOpenEdit}
        boardID={board.id}
        list={list}
      />
      <ConfirmModal
        open={isOpenDelete}
        onOpenChange={setOpenDelete}
        title="Usunąć"
        message={`Czy na pewno chcesz usunąć listę o nazwie: ${list?.name} ?`}
        onSubmit={() => {
          mutate(list?.id, {
            onSuccess: (data) => {
              route.refresh();
              toast.success(data?.message);
            },
            onError: (err) => console.log(err),
          });
          setOpenDelete(false);
        }}
        onCancel={() => {
          setOpenDelete(false);
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
