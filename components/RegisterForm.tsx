"use client";

import { FieldError } from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerShema, type RegisterTypes } from "@/schema/registerSchem";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterTypes>({
    resolver: zodResolver(registerShema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: RegisterTypes) => {
      const response = await axios.post("/api/register", data);

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
            placeholder="Email"
            {...register("email")}
          />
          <FieldError errors={[errors.email]} className="" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Hasło</Label>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          <FieldError errors={[errors.password]} className="" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Powtórz hasło</Label>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} className="" />
        </div>
        <Button type="submit" className="w-full">
          Zarejestruj się
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Masz już konto?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Zaloguj się
        </Link>
      </div>
    </CardContent>
  );
}
