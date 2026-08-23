"use client";

import { useEffect } from "react";
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
import { Project } from "@/types/project.type";

type EditProjectProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | undefined;
};

export default function EditProject({
  open,
  onOpenChange,
  project = undefined,
}: EditProjectProps) {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AddProjectType>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      name: project?.name,
      description: project?.description,
    },
  });

  //Defualt values tylko przy pierwszym renderze
  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description ?? "",
      });
    }
  }, [project, reset]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddProjectType) => {
      const response = await axios.patch(
        `/api/projects/${project?.id}`,
        { ...data },
        {
          withCredentials: true,
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      router.refresh();
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Wystąpił błąd");
      }
    },
  });

  const submit = (data: AddProjectType) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edytuj projekt</DialogTitle>
          <DialogDescription>
            Edytuj projekt, który już istnieje
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="project-name">Nazwa projektu</Label>

            <Input
              id="project-name"
              placeholder="np. Website redesign"
              {...register("name")}
              disabled={isPending}
              autoFocus
            />
            <FieldError errors={[errors.name]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Opis</Label>

            <Textarea
              id="project-description"
              placeholder="O czym jest ten projekt?"
              {...register("description")}
              disabled={isPending}
              rows={4}
            />
            <FieldError errors={[errors.description]} />
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
              {isPending ? "Edytowanie..." : "Edytuj projekt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
