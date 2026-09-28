"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { addProjectSchema, AddProjectType } from "@/schema/addproject.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ProjectForm } from "../ProjectForm";

type CreateProjectProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateProject({
  open,
  onOpenChange,
}: CreateProjectProps) {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AddProjectType>({
    resolver: zodResolver(addProjectSchema),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddProjectType) => {
      const response = await axios.post("/api/projects", data, {
        withCredentials: true,
      });

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
    />
  );
}
