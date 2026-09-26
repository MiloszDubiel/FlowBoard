"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type CreateCardForm, createCardSchema } from "@/schema/addcard.schema";

interface CreateCardModalProps {
  listId: number;
  members: any[];
  boardId: number;
}
type Task = {
  name: string;
  isCompleted: boolean;
};

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCard } from "@/mutations/dashboard/useCard";
import { useState } from "react";
import CardForm from "../CardForm";
import { BoardMember, CardMember } from "@/generated/prisma/client";

export default function AddCard({
  listId,
  members = [],
  boardId,
  labels,
}: any) {
  const route = useRouter();
  const [, setSelectedUsers] = useState<number[]>([]);
  const [imgFiles, setImgFiles] = useState<File[] | null>(null);
  const [textFils, setTextFiles] = useState<File[] | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTasks, setCurrentTasks] = useState<string>("");

  const {
    addFile: { mutate: addFile },
    addCard: { mutate: addCard },
  } = useCard();

  const addTask = () => {
    setTasks((prevTasks) => {
      const findTask = prevTasks.find(
        (task) => task.name.toUpperCase() === currentTasks.toUpperCase(),
      );

      if (findTask) {
        toast.error("Zadanie już istnieje");
        return prevTasks;
      }

      return [...prevTasks, { name: currentTasks, isCompleted: false }];
    });
  };

  console.log(labels);

  const onSubmit = async (data: CreateCardForm) => {
    console.log(data);

    addCard(
      { ...data, tasks, listId },
      {
        onSuccess: (data) => {
          const formData = new FormData();

          imgFiles?.forEach((file) => {
            formData.append("img", file);
          });
          textFils?.forEach((file) => {
            formData.append("txt", file);
          });

          formData.append("cardId", data.cardId);

          addFile(formData);
          toast.success(data.message);

          route.replace(`/projects/board/${boardId}`);
        },
      },
    );

    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Utwórz kartę</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Utwórz nową kartę i przypisz do niej użytkowników.
        </p>
      </div>
      <CardForm
        config={{
          currentTasks,
          setCurrentTasks,
          addTask,
          tasks,
          setImgFiles,
          setTextFiles,
        }}
        members={members
          .filter((el: BoardMember) => el.role === "MEMBER")
          .map((el: any) => ({ id: el.userId, name: el.user.name }))}
        onSubmit={onSubmit}
        labels={labels}
        onSelectUser={setSelectedUsers}
        defaults={{
          title: "",
          description: "",
          dueDate: "",
          priority: "MEDIUM",
          userIds: [],
        }}
      />
    </div>
  );
}
