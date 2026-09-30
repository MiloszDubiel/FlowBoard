import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

export const Notification = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Powiadomienia</CardTitle>
        <CardDescription>
          Wybierz, o czym chcesz otrzymywać powiadomienia.
        </CardDescription>
      </CardHeader>

      <CardContent className="divide-y">
        {[
          {
            key: "email" as const,
            title: "Powiadomienia e-mail",
            description: "Powiadomienia wysyłane na e-mail.",
          },
          {
            key: "taskAssigned" as const,
            title: "Przypisanie do zadania",
            description: "Gdy ktoś przypisze Cię do karty.",
          },
          {
            key: "comments" as const,
            title: "Komentarze",
            description: "Gdy ktoś skomentuje Twoją kartę.",
          },
          {
            key: "deadlines" as const,
            title: "Terminy zadań",
            description: "Przypomnienia o zbliżających się terminach.",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 py-5"
          >
            <div className="space-y-1">
              <Label>{item.title}</Label>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>

            {/* <Switch
                        checked={notifications[item.key]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: checked,
                          }))
                        }
                      /> */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
