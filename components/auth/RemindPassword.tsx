"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Check, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { z } from "zod";

const remindSchema = z.object({
  email: z
    .email({ error: "Niepoprawny adres email" })
    .trim()
    .toLowerCase()
    .min(1, "Podaj poprawny email"),
});

type RemindSchema = z.infer<typeof remindSchema>;

export default function RemindPassword() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RemindSchema>({
    resolver: zodResolver(remindSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RemindSchema) => {
      const response = await axios.post("/api/auth/forgot-password", data);

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      setSuccess(true);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Wystąpił nieoczekiwany błąd",
        );
      }
    },
  });

  const submit = (data: RemindSchema) => {
    mutate(data);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
          <Check className="size-8 text-green-600 dark:text-green-400" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight">
          Sprawdź swoją skrzynkę
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Jeśli podany adres e-mail jest powiązany z kontem, wysłaliśmy na niego
          instrukcję resetowania hasła.
        </p>

        <div className="mt-6 flex w-full items-center gap-3 rounded-lg border bg-muted/40 p-3 text-left">
          <Mail className="size-5 shrink-0 text-muted-foreground" />

          <p className="text-xs leading-5 text-muted-foreground">
            Nie widzisz wiadomości? Sprawdź folder <strong>Spam</strong> lub
            <strong> Oferty</strong>.
          </p>
        </div>

        <Button variant="outline" className="mt-6 w-full">
          <Link href="/login" className="flex items-center">
            <ArrowLeft className="mr-2 size-4" />
            Wróć do logowania
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Adres e-mail</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="h-11 pl-10"
              autoComplete="email"
              {...register("email")}
            />
          </div>

          <FieldError errors={[errors.email]} />
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Wysyłanie...
            </>
          ) : (
            <>
              Wyślij link do resetowania
              <ArrowLeft className="ml-2 size-4 rotate-180" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <p className="text-xs leading-5 text-muted-foreground">
          Ze względów bezpieczeństwa nie informujemy, czy podany adres e-mail
          posiada konto.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Wróć do logowania
        </Link>
      </div>
    </div>
  );
}
