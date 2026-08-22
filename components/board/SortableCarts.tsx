"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

export const SortableCard = ({
  id,
  index,
  card,
}: {
  id: number;
  index: number;
  card: any;
}) => {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({
    id,
    index,
    element,
    handle: handleRef,
  });

  return (
    <Card
      key={card.id}
      className="group relative cursor-pointer bg-card transition-shadow hover:shadow-md"
      data-shadow={isDragging || undefined}
      ref={setElement}
    >
      <Button
        ref={handleRef}
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-7 w-7 cursor-grab text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground active:cursor-grabbing group-hover:opacity-100"
        title="Przenieś kartę"
      >
        <GripVertical className="h-4 w-4" />
      </Button>

      <CardContent className="p-3 pr-10">
        <p className="text-sm font-medium text-card-foreground">{card.title}</p>
      </CardContent>
    </Card>
  );
};
