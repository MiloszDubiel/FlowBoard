"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginTypes, loginSchema } from "@/schema/login.schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { FieldError } from "../ui/field";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginTypes>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginTypes) => {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/projects");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Wystąpił błąd");
      }
    },
  });

  const submit = (data: LoginTypes) => {
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Hasło</Label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Nie pamiętasz hasła?
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-11 pl-10"
              {...register("password")}
            />
          </div>

          <FieldError errors={[errors.password]} />
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Logowanie...
            </>
          ) : (
            "Zaloguj się"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Nie masz jeszcze konta?{" "}
        <Link
          href="/register"
          className="font-medium text-primary transition-colors hover:underline"
        >
          Zarejestruj się
        </Link>
      </div>
    </CardContent>
  );
}
