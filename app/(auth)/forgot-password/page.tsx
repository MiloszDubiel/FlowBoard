import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RemindPassword from "@/components/auth/RemindPassword";
import { LogIn } from "lucide-react";

export default function RemindPasswordPage() {
  return (
    <section className="flex min-h-screen items-center justify-center w-96 px-4 py-8">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <LogIn className="size-7 text-primary" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Nie pamiętasz hasła?
            </h1>

            <p className="text-sm text-muted-foreground">
              Podaj adres e-mail powiązany z Twoim kontem.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <RemindPassword />
        </CardContent>
      </Card>
    </section>
  );
}
