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
import { ProjectForm } from "../ProjectForm";
import { colorRecord } from "@/lib/colors";
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
      color: project?.color || "ORANGE",
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description ?? "",
        color: project.color ?? "ORANGE",
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
    <ProjectForm
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={submit}
      handleSubmit={handleSubmit}
      register={register}
      errors={errors}
      isPending={isPending}
      type="edit"
    />
  );
}
