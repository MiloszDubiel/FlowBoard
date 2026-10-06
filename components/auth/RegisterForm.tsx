"use client";

import { FieldError } from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerShema, type RegisterTypes } from "@/schema/register.schem";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Lock, LockKeyhole, Mail } from "lucide-react";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterTypes>({
    resolver: zodResolver(registerShema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RegisterTypes) => {
      const response = await axios.post("/api/auth/register", data);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Wystąpił błąd");
      }
    },
  });

  const submit = (data: RegisterTypes) => {
    mutate(data);
  };

  return (
    <CardContent className="w-full">
      <form
        className="space-y-5"
        onSubmit={handleSubmit(submit, (err) => console.log(err))}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Adres e-mail</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              className="h-11 pl-10"
              {...register("email")}
            />
          </div>

          <FieldError errors={[errors.email]} />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="h-11 pl-10"
              {...register("password")}
            />
          </div>

          <FieldError errors={[errors.password]} />
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Powtórz hasło</Label>

          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
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
              Rejestrowanie...
            </>
          ) : (
            "Zarejestruj się"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Masz już konto?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition-colors hover:underline"
        >
          Zaloguj się
        </Link>
      </div>
    </CardContent>
  );
}
