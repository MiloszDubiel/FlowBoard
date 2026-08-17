"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  return (
    <CardContent className="w-96">
      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="twoj@email.pl" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Hasło</Label>

            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Nie pamiętasz hasła?
            </Link>
          </div>

          <Input id="password" type="password" placeholder="••••••••" />
        </div>

        <Button type="submit" className="w-full">
          Zaloguj się
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Nie masz jeszcze konta?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Zarejestruj się
        </Link>
      </div>
    </CardContent>
  );
}
