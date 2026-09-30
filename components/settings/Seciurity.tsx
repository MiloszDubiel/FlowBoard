import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Security = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bezpieczeństwo</CardTitle>
        <CardDescription>
          Zmień hasło i zadbaj o bezpieczeństwo swojego konta.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Aktualne hasło</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Wprowadź aktualne hasło"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Nowe hasło</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Wprowadź nowe hasło"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Powtórz nowe hasło</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Powtórz nowe hasło"
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button>
            <LockKeyhole className="mr-2 size-4" />
            Zmień hasło
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
