import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Clock, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResetPassword from "@/components/auth/ResetPassword";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ResetPasswordPage({
  _,
  searchParams,
}: {
  _: any;
  searchParams?: Promise<{ token: string }>;
}) {
  const token = (await searchParams)?.token;

  const data = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash: token,
    },
  });

  const expires = new Date(data?.expiresAt || 0);

  if (expires.getTime() < new Date().getTime()) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center flex flex-col">
          <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <Clock className="size-8 text-destructive" />
          </div>

          <CardTitle className="text-2xl">Link wygasł</CardTitle>

          <CardDescription className="max-w-sm text-center">
            Link do resetowania hasła stracił ważność. Ze względów
            bezpieczeństwa możesz go użyć tylko przez określony czas.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
            Wygeneruj nowy link, aby ponownie ustawić swoje hasło.
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full">
            <Link href="/forgot-password">Wyślij nowy link</Link>
          </Button>

          <Button variant="outline" className="w-full">
            <Link href="/login">Wróć do logowania</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center w-96 px-4 py-8">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <LockKeyhole className="size-7 text-primary" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Ustaw nowe hasło
            </CardTitle>

            <CardDescription>
              Wprowadź nowe hasło, aby odzyskać dostęp do swojego konta
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <ResetPassword
            userId={Number(data?.userId)}
            token={String(data?.tokenHash)}
          />
        </CardContent>
      </Card>
    </section>
  );
}
