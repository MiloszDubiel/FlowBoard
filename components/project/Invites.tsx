"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GetInvitsType } from "@/lib/data/inivts";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type InvitesProps = {
  invites: GetInvitsType[];
};

export default function Invites({ invites = [] }: InvitesProps) {
  const route = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (boardId) => {
      const { data } = await axios.post("/api/invits/accept", { boardId });

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
      route.refresh();
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Zaproszenia</h1>
        <p className="text-muted-foreground">
          Tutaj znajdziesz zaproszenia do tablic.
        </p>
      </div>

      {invites.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Nie masz żadnych zaproszeń.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {invites.map((invite: any) => (
            <Card key={invite.id}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <h2 className="font-semibold">
                    Projekt: {invite.board.project.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Tablica {invite.board.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Zaproszenie od: {invite.board.project.owner.email}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {}}>
                    <X />
                    Odrzuć
                  </Button>

                  <Button
                    onClick={() => {
                      mutate(invite.board.id);
                    }}
                  >
                    <Check />
                    Akceptuj
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
