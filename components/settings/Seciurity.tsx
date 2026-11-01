import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ResetPasswordSchema } from "@/schema/resetPassword.schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldError } from "../ui/field";
import { useState } from "react";

export const Security = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (
      body: ResetPasswordSchema & { currentPassword: string },
    ) => {
      const { data } = await axios.patch("api/settings/security", { body });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

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
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Nowe hasło</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Wprowadź nowe hasło"
            {...register("password")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Powtórz nowe hasło</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Powtórz nowe hasło"
            {...register("confirmPassword")}
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit((data) =>
              mutate({ ...data, currentPassword }),
            )}
          >
            <LockKeyhole className="mr-2 size-4" />
            Zmień hasło
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
