import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

export const Appirance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wygląd</CardTitle>
        <CardDescription>
          Dostosuj wygląd aplikacji do swoich preferencji.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <Label>Motyw aplikacji</Label>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { id: "light", label: "Jasny" },
            { id: "dark", label: "Ciemny" },
            { id: "system", label: "Systemowy" },
          ].map((item) => (
            <button
              key={item.id}
            //   onClick={() => setTheme(item.id)}
            //   className={`rounded-xl border-2 p-3 text-left transition ${
            //     theme === item.id
            //       ? "border-primary bg-accent"
            //       : "border-border hover:border-muted-foreground/40"
            //   }`}
            >
              <div
                className={`mb-3 flex h-24 items-center justify-center rounded-lg ${
                  item.id === "dark"
                    ? "bg-zinc-900"
                    : item.id === "system"
                      ? "bg-linear-to-r from-white to-zinc-900"
                      : "bg-muted"
                }`}
              >
                <div
                  className={`h-12 w-16 rounded-md shadow ${
                    item.id === "dark" ? "bg-zinc-700" : "bg-white"
                  }`}
                />
              </div>
              <p className="text-sm font-medium">{item.label}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
