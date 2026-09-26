"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, CalendarDays, Paperclip, Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ca } from "zod/v4/locales";

const priorityRecord: Record<string, string> = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
  URGENT: "Nagły",
};

const setStyle = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "bg-green-500/10 text-green-600 dark:text-green-400";

    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";

    case "HIGH":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

    case "URGENT":
      return "bg-red-500/10 text-red-600 dark:text-red-400";

    default:
      return "bg-muted text-muted-foreground";
  }
};

export function TaskCard({ id, index, column, card, role }: any) {
  const { ref, isDragging, handleRef } = useSortable({
    id,
    index,
    type: "item",
    accept: ["item"],
    collisionPriority: CollisionPriority.High,
  });
  const path = usePathname();
  const route = useRouter();

  console.log(card);

  return (
    <Card
      ref={["OWNER", "ADMIN"].includes(role) ? ref : null}
      className="group relative cursor-pointer overflow-hidden border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
      data-dragging={["OWNER", "ADMIN"].includes(role) ? isDragging : null}
      onClick={() => route.replace(path + `/card/get-card/${card.id}`)}
    >
      {["OWNER", "ADMIN"].includes(role) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-7 w-7 cursor-grab text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground active:cursor-grabbing group-hover:opacity-100"
          title="Przenieś kartę"
          ref={handleRef}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      )}
      <CardContent className="p-3">
        {/* Tytuł + opis */}
        <div className="pr-7">
          <p className="text-sm font-medium leading-5 text-card-foreground">
            {card?.title}
          </p>

          {card?.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {card.description}
            </p>
          )}
        </div>

        {/* Autor + ID */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={card?.createdBy?.avatarUrl ?? undefined}
                alt={card?.createdBy?.name ?? ""}
              />

              <AvatarFallback className="text-[10px]">
                {card?.createdBy?.name?.slice(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <span className="text-xs text-muted-foreground">
              {card?.createdBy?.name}
            </span>
          </div>

          <span className="text-[11px] text-muted-foreground/60">
            #{card?.id}
          </span>
        </div>

    
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${setStyle(
              card?.priority,
            )}`}
          >
            {priorityRecord[card?.priority] ?? card?.priority}
          </span>

          {card?.labels?.map((item: any) => (
            <span
              key={item.label.id}
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{
                backgroundColor: `${item.label.color}20`,
                color: item.label.color,
                border: `1px solid ${item.label.color}40`,
              }}
            >
              {item.label.name}
            </span>
          ))}
        </div>


        {card?.attachments?.length > 0 && (
          <div className="mt-3">
            <Carousel className="w-full">
              <CarouselContent>
                {card.attachments.map((attachment: any) => (
                  <CarouselItem key={`attachment-${attachment.id}`}>
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={attachment.fileUrl}
                        alt={attachment.fileName ?? "Załącznik"}
                        className="h-40 w-full object-cover transition-transform group-hover:scale-[1.02]"
                      />
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {card.attachments.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>
        )}


        <div className="mt-3 flex items-center gap-3 border-t border-border/50 pt-2.5">
  
          {card?.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />

              <span>{new Date(card.dueDate).toLocaleDateString("pl-PL")}</span>
            </div>
          )}

   
          {card?.attachments?.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Paperclip className="h-3.5 w-3.5" />

              <span>{card.attachments.length}</span>
            </div>
          )}


          {card?.members?.length > 0 && (
            <div className="ml-auto flex -space-x-1.5">
              {card.members.slice(0, 3).map((member: any) => (
                <Avatar
                  key={member.userId}
                  className="h-6 w-6 border-2 border-card"
                >
                  <AvatarImage
                    src={member.user?.avatarUrl ?? undefined}
                    alt={member.user?.name ?? ""}
                  />

                  <AvatarFallback className="text-[9px]">
                    {member.user?.name?.slice(0, 1).toUpperCase() ?? "U"}
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
}
