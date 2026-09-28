"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetInvitsType } from "@/lib/data/inivts";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Mail, UserRound, X, FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

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
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zaproszenia</h1>

          <p className="mt-2 text-muted-foreground">
            Zarządzaj zaproszeniami do tablic i dołączaj do projektów.
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Oczekujące zaproszenia
              </p>

              <p className="text-2xl font-bold">{invites.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista zaproszeń */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Otrzymane zaproszenia</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Sprawdź, do jakich tablic zostałeś zaproszony.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
            {invites.length}
          </span>
        </div>

        {invites.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Mail className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">
                Brak oczekujących zaproszeń
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Gdy ktoś zaprosi Cię do swojej tablicy, pojawi się ona tutaj.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {invites.map((invite: any) => (
              <Card
                key={invite.id}
                className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                        <FolderKanban className="h-5 w-5 text-blue-500" />
                      </div>

                      <div className="min-w-0">
                        <CardTitle className="truncate text-base">
                          {invite.board.name}
                        </CardTitle>

                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          Projekt:{" "}
                          <span className="font-medium text-foreground">
                            {invite.board.project.name}
                          </span>
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="secondary"
                      className="shrink-0 bg-orange-500/10 text-orange-600 hover:bg-orange-500/10 dark:text-orange-400"
                    >
                      Oczekujące
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Informacje o zapraszającym */}
                  <div className="mb-5 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background">
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Zaproszenie od
                      </p>

                      <p className="truncate text-sm font-medium">
                        {invite.board.project.owner.email}
                      </p>
                    </div>
                  </div>

                  {/* Przyciski */}
                  <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row">
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer"
                      disabled={isPending}
                      onClick={() => {
                        // Tutaj podepnij mutację odrzucania zaproszenia
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Odrzuć
                    </Button>

                    <Button
                      className="flex-1 cursor-pointer"
                      disabled={isPending}
                      onClick={() => {
                        mutate(invite.board.id);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Akceptuj
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
