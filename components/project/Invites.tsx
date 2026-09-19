"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GetInvitsType } from "@/lib/data/inivts";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Clock3, Mail, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type InvitesProps = { invites: GetInvitsType[] };
export default function Invites({ invites = [] }: InvitesProps) {
  const route = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (boardId: number) => {
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
      } else {
        toast.error("Wystąpił błąd");
      }
      route.refresh();
    },
  });
  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-8">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
          <Mail className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight"> Zaproszenia </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tutaj znajdziesz zaproszenia do tablic, do których zostałeś
          zaproszony.
        </p>
      </div>

      {invites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex min-h-52 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="font-semibold"> Brak zaproszeń </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Aktualnie nie masz żadnych oczekujących zaproszeń do tablic.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium"> Oczekujące zaproszenia </p>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
              {invites.length}
            </span>
          </div>

          <div className="space-y-3">
            {invites.map((invite: any) => (
              <Card
                key={invite.id}
                className="overflow-hidden transition-colors hover:bg-muted/20"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                        <Clock3 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h2 className="truncate font-semibold">
                          {invite.board.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Projekt:
                          <span className="font-medium text-foreground">
                            {invite.board.project.name}
                          </span>
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <UserRound className="h-3.5 w-3.5" />
                          <span>
                            Zaproszenie od
                            <span className="font-medium">
                              {invite.board.project.owner.email}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => {}}
                      >
                        <X className="mr-1.5 h-4 w-4" /> Odrzuć
                      </Button>
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() => {
                          mutate(invite.board.id);
                        }}
                      >
                        <Check className="mr-1.5 h-4 w-4" /> Akceptuj
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
