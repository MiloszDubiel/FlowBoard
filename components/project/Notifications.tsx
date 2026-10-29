import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";
import { Notification } from "@/generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";

type Props = {
  side?: "right" | undefined;
  trigger: React.ReactElement;
};

export const Notifications = ({ side, trigger }: Props) => {
  const { notifications, refetch, setNotifications } = useNotification();

  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      setNotifications((prev) => {
        return prev.filter((el) => el.id !== id);
      });

      const { data } = await axios.delete(`/api/notification/${id}`);

      return data;
    },
    onSuccess: (data) => {
      toast.message(data.message);
      refetch();
    },
  });

  useEffect(() => {
    const interval = setInterval(() => refetch(), 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger render={trigger}>Otwórz</PopoverTrigger>
      <PopoverContent side={side}>
        <PopoverHeader>
          <PopoverTitle>Powiadomienia</PopoverTitle>
        </PopoverHeader>
        <Card>
          <CardContent className="p-2">
            {notifications.length > 0 ? (
              <div className="flex flex-col gap-2">
                {notifications.map((el: Notification) => (
                  <div
                    key={el.id}
                    className="flex w-full items-center justify-between gap-4 rounded-md p-2 hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(el.createdAt).toLocaleString("pl-PL")}
                      </p>
                      <p className="wrap-break-word text-sm">{el.message}</p>
                    </div>

                    <button
                      type="button"
                      aria-label="Usuń powiadomienie"
                      className="shrink-0 rounded-md p-2 text-red-600 hover:bg-red-100"
                      onClick={() => mutate(el.id)}
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Brak powiadomień
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
