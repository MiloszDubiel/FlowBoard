"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { Check, LogIn, Lock, LockKeyhole, Loader2 } from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/schema/resetPassword.schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

export default function ResetPasswordForm({
  token,
  userId,
}: {
  token: string;
  userId: number;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [success, setSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: ResetPasswordSchema) => {
      const { data } = await axios.post("/api/auth/reset-password", {
        userId,
        token,
        password: body.password,
        confirmPassword: body.confirmPassword,
      });

      return data;
    },
    onSuccess: (data: any) => {
      toast.success(data.message);
      setSuccess(true);
    },
  });

  const submit = (data: ResetPasswordSchema) => {
    mutate(data);
  };

  return success ? (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
        <Check className="size-8 text-green-600 dark:text-green-400" />
      </div>

      <h2 className="text-xl font-semibold tracking-tight">
        Hasło zostało zmienione
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Twoje hasło zostało pomyślnie zresetowane. Możesz teraz zalogować się
        przy użyciu nowego hasła.
      </p>

      <Button className="mt-6 w-full">
        <Link href="/login" className="flex items-center">
          <LogIn className="mr-2 size-4" />
          Przejdź do logowania
        </Link>
      </Button>
    </div>
  ) : (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password">Nowe hasło</Label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="password"
            type="password"
            placeholder="Wpisz nowe hasło"
            autoComplete="new-password"
            className="h-11 pl-10"
            {...register("password")}
          />
        </div>

        <FieldError errors={[errors.password]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>

        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="confirmPassword"
            type="password"
            placeholder="Powtórz nowe hasło"
            autoComplete="new-password"
            className="h-11 pl-10"
            {...register("confirmPassword")}
          />
        </div>

        <FieldError errors={[errors.confirmPassword]} />
      </div>

      <Button type="submit" className="h-11 w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Zmienianie hasła...
          </>
        ) : (
          <>
            Zmień hasło
            <Check className="ml-2 size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
