import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { X, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";

function MembersList({
  members,
  roles,
  changeRole,
  setRemoveModalOpen,
  setSelectedMember,
}: any) {
  const { user } = useUser();

  return (
    <div className="rounded-md border p-2">
      {members.length > 0 ? (
        members.map((member: any) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {member.user.name
                    .split(" ")
                    .map((name: string[0]) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium">{member.user.name}</p>

                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
            </div>

            {
              <div className="flex items-center gap-2">
                {member.role !== "OWNER" && (
                  <>
                    <Select
                      items={roles}
                      onValueChange={(role) =>
                        changeRole({
                          id: member.userId,
                          role,
                        })
                      }
                      defaultValue={member.role || "MEMBER"}
                      disabled={member.userId == user?.id}
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rola</SelectLabel>
                          {roles.map((item: any) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              disabled={
                                item.disabled || member.userId == user?.id
                              }
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {member.userId == user?.id ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRemoveModalOpen(true);
                          setSelectedMember(member);
                        }}
                      >
                        <LogOut />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRemoveModalOpen(true);
                          setSelectedMember(member);
                        }}
                      >
                        <X />
                      </Button>
                    )}
                  </>
                )}
              </div>
            }
          </div>
        ))
      ) : (
        <div className="flex items-center justify-between rounded-md p-2">
          Brak członków
        </div>
      )}
    </div>
  );
}

export default MembersList;
