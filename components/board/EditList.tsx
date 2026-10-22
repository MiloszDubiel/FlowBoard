"use client";

import { useMutation } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addListSchema, AddListType } from "@/schema/addlist.schema";
import { List } from "@/generated/prisma/client";
import { Spinner } from "../Spinner";

type EditListProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardID: number;
  list: List | undefined;
};

export default function EditList({
  open,
  onOpenChange,
  boardID,
  list,
}: EditListProps) {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AddListType>({
    resolver: zodResolver(addListSchema),
    defaultValues: {
      name: list?.name,
    },
  });

  useEffect(() => {
    if (list) {
      reset({
        name: list.name,
      });
    }
  }, [list, reset]);

  const {
    mutate,
    isPending,
    isSuccess,
    reset: resetMutation,
  } = useMutation({
    mutationFn: async (name: AddListType) => {
      const { data } = await axios.patch(`/api/list/${list?.id}`, {
        ...name,
      });

      return data;
    },
    onSuccess: (data) => {
      router.refresh();
      toast.success(data.message);
      onOpenChange(false);
      reset();
      resetMutation();
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
          <DialogTitle>Edytuj listę</DialogTitle>
          <DialogDescription>Edytuj istniejącą listę</DialogDescription>
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
              disabled={isPending || isSuccess}
              className="cursor-pointer"
            >
              Anuluj
            </Button>

            <Button
              type="submit"
              disabled={isPending || isSuccess}
              className="cursor-pointer"
            >
              {isPending ? <Spinner text="Edytowanie..." /> : "Edytuj listę"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
