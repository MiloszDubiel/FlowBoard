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
import { FieldError } from "@/components/ui/field";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginTypes>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: LoginTypes) => {
      const response = await axios.post("/api/login", data);

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

  const submit = (data: LoginTypes) => {
    mutate(data);
  };

  return (
    <CardContent className="w-96">
      <form
        className="space-y-5"
        onSubmit={handleSubmit(submit, (err) => console.log(err))}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="email"
          />
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

          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="••••••••"
          />
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
