"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, CalendarDays, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/react/sortable";

type CardItemProps = {
  card: any;
  index: number;
  column: number;
};

export const TaskCard = ({ card, index, column }: CardItemProps) => {
  const { ref } = useSortable({
    id: card.id,
    index,
    type: "card",
    group: "cards",
  });

  return (
    <Card
      ref={ref}
      key={card.id}
      className="group relative cursor-pointer overflow-hidden border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-7 w-7 cursor-grab text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground active:cursor-grabbing group-hover:opacity-100"
        title="Przenieś kartę"
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <CardContent className="p-3">
        <div className="pr-7">
          <p className="text-sm font-medium leading-5 text-card-foreground">
            {card.title}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={card.createdBy?.avatarUrl ?? undefined}
                alt={card.createdBy?.name ?? ""}
              />
              <AvatarFallback className="text-[10px]">
                {card.createdBy?.name?.slice(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <span className="text-xs text-muted-foreground">
              {card.createdBy?.name}
            </span>
          </div>

          <span className="text-[11px] text-muted-foreground/60">
            #{card.id}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 border-t border-border/50 pt-2.5">
          {card.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />

              <span>{new Date(card.dueDate).toLocaleDateString("pl-PL")}</span>
            </div>
          )}

          {card.attachments?.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Paperclip className="h-3.5 w-3.5" />
              <span>{card.attachments.length}</span>
            </div>
          )}

          {card.members?.length > 0 && (
            <div className="ml-auto flex -space-x-1.5">
              {card.members.slice(0, 3).map((member: any) => (
                <Avatar
                  key={member.userId}
                  className="h-6 w-6 border-2 border-card"
                >
                  <AvatarImage
                    src={member.user.avatarUrl ?? undefined}
                    alt={member.user.name ?? ""}
                  />

                  <AvatarFallback className="text-[9px]">
                    {member.user.name?.slice(0, 1).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              ))}

              {card.members.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] font-medium">
                  +{card.members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
