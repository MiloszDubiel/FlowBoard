"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FieldError } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { addProjectSchema, AddProjectType } from "@/schema/addproject.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addListSchema, AddListType } from "@/schema/addlist.schema";

type AddListProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardID: number;
};

export default function AddList({ open, onOpenChange, boardID }: AddListProps) {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AddListType>({
    resolver: zodResolver(addListSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (name: AddListType) => {
      const { data } = await axios.post(`/api/cards/`, {
        ...name,
        id: boardID,
      });

      return data;
    },
    onSuccess: (data) => {
      router.refresh();
      toast.success(data.message);
      onOpenChange(false);
      reset()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Wystąpił błąd");
      }
    },
  });

  const submit = (data: AddListType) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Stwórz listę</DialogTitle>
          <DialogDescription>
            Utwórz listę, aby móc do niej dodawać zadania
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="list-name">Nazwa listy</Label>

            <Input
              id="list-name"
              placeholder="np. TO DO"
              {...register("name")}
              disabled={isPending}
              autoFocus
            />
            <FieldError errors={[errors.name]} />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Anuluj
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? "Tworzenie..." : "Utwórz listę"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
