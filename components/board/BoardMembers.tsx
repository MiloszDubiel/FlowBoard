"use client";

import { Suspense } from "react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, X } from "lucide-react";
import { debounce } from "@/lib/debounce";
import { searchUsers } from "@/actions/searchUsers";
import ConfirmModal from "../modals/ConfirmModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MembersList from "./MemberList";
import MembersSkeleton from "../skeletons/MemberSkeleton";

type BoardMembersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members?: any[];
  boardId: number;
};

const roles = [
  { label: "Wybierz rolę", value: null, disabled: true },
  { label: "Członek", value: "MEMBER" },
  { label: "Administrator", value: "ADMIN" },
];

export default function BoardMembersModal({
  open,
  onOpenChange,
  members = [],
  boardId,
}: BoardMembersModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [userIdToAdd, setIdUserToAdd] = useState<number>();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value.length === 0) return setUsers([]);
        const users = await searchUsers(value, boardId);
        setUsers(users);
      }, 300),
    [],
  );

  const route = useRouter();

  const { mutate: sendInvit } = useMutation({
    mutationFn: async (uid: number | undefined) => {
      if (!uid) return;
      const { data } = await axios.put(
        `/api/board/${boardId}/member/${uid}/invite`,
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      route.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Wystąpił błąd");
      }
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(
        `/api/board/${boardId}/member/${id}/delete`,
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setSelectedMember(null);
      route.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Wystąpił błąd");
      }
    },
  });

  const { mutate: changeRole } = useMutation({
    mutationFn: async ({ id, role }: any) => {
      const { data } = await axios.patch(
        `/api/board/${boardId}/member/${id}/role`,
        {
          role,
        },
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setSelectedMember(null);
      route.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Wystąpił błąd");
      }
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125 z-50">
          <DialogHeader>
            <DialogTitle>Członkowie tablicy</DialogTitle>

            <DialogDescription>
              Zarządzaj osobami, które mają dostęp do tej tablicy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium">Dodaj członka</p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  {
                    <Input
                      placeholder="Wyszukaj użytkownika..."
                      className="pl-9"
                      onKeyUp={({ target }: { target: any }) => {
                        debouncedSearch(target.value);
                      }}
                    />
                  }
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Wyniki wyszukiwania</p>

              <div className="rounded-md border p-2">
                {users?.length > 0 ? (
                  users?.map((el: any) => (
                    <div
                      className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
                      key={el.id}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {el.name
                              .split(" ")
                              .map((name: any) => name[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-medium">{el.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {el.email}
                          </p>
                        </div>
                      </div>

                      {el.boardInvites?.[0]?.status == "PENDING" ? (
                        <p className="text-sm">WYSŁANO</p>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsOpen(true);
                            setMessage(
                              `Czy na pewno chcesz dodać użytkownika ${el.name}? Email: ${el.email}`,
                            );
                            setIdUserToAdd(Number(el.id));
                          }}
                        >
                          Dodaj
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between rounded-md p-2">
                    Brak wyników
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Członkowie</p>

                <span className="text-xs text-muted-foreground">
                  {members?.length}
                </span>
              </div>

              <Suspense fallback={<MembersSkeleton />}>
                <MembersList
                  members={members}
                  roles={roles}
                  changeRole={changeRole}
                  setRemoveModalOpen={setRemoveModalOpen}
                  setSelectedMember={setSelectedMember}
                />
              </Suspense>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Dodać?"
        message={message}
        onCancel={() => {
          setIsOpen(false);
        }}
        onSubmit={() => {
          sendInvit(userIdToAdd);
          setIsOpen(false);
        }}
      />
      <ConfirmModal
        open={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        title="Usunąć członka?"
        message={
          selectedMember
            ? `Czy na pewno chcesz usunąć użytkownika ${selectedMember.user.name} z tej tablicy?`
            : ""
        }
        onCancel={() => {
          setRemoveModalOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={() => {
          setRemoveModalOpen(false);
          deleteUser(selectedMember.user.id);
        }}
      />
    </>
  );
}
