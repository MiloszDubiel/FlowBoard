"use client";

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


type BoardMember = {
  id: number;
  name: string;
  email: string;
  role: "OWNER" | "MEMBER";
};

type BoardMembersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members?: BoardMember[];
};



export default function BoardMembersModal({
  open,
  onOpenChange,
  members = [],
}: BoardMembersModalProps) {
  

  const [users, setUsers] = useState<any[]>();
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value.length < 2) return;

        const users = await searchUsers(value);

        setUsers(users);
      }, 300),
    [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
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

                <Input
                  placeholder="Wyszukaj użytkownika..."
                  className="pl-9"
                  onKeyUp={({ target }: { target: any }) => {
                    debouncedSearch(target.value);
                  }}
                />
              </div>

              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Dodaj
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Wyniki wyszukiwania</p>

            <div className="rounded-md border p-2">
              {users?.map((el: any) => (
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {" "}
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

                  <Button size="sm" variant="outline" onClick={() => {}}>
                    Dodaj
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Członkowie</p>

              <span className="text-xs text-muted-foreground">
                {members.length}
              </span>
            </div>

            <div className="max-h-70 overflow-y-auto rounded-md border">
              {members.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Brak członków tablicy
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-medium">{member.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      {member.role === "OWNER" ? (
                        <span className="text-xs font-medium text-muted-foreground">
                          Właściciel
                        </span>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <ConfirmModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Dodać?"
        message="Czy chcesz dodać użytkownika?"
        onCancel={() => {}}
        onSubmit={() => {}}
      />
    </Dialog>
  );
}
