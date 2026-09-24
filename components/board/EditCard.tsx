"use client";

import { type CreateCardForm, createCardSchema } from "@/schema/addcard.schema";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import CardForm from "../CardForm";
import { useCard } from "@/mutations/dashboard/useCard";
import { Attachment } from "@/generated/prisma/client";

interface CreateCardModalProps {
  card: any;
  cardMemebrs: any;
}
type Task = {
  name: string;
  isCompleted: boolean;
};

const formatDateTimeLocal = (date: Date | null) => {
  if (!date) return "";

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
export default function EditCard({
  cardMemebrs = [],
  card,
}: CreateCardModalProps) {
  const [imgFiles, setImgFiles] = useState<File[] | null>(null);
  const [textFils, setTextFiles] = useState<File[] | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fileToDelete, setFileToDelete] = useState<Attachment[]>([]);
  const [currentTasks, setCurrentTasks] = useState<string>("");
  const route = useRouter();

  const {
    editCard: { mutate: editCard },
    addFile: { mutate: addFile },
    removeFile: { mutate: removeFiles },
  } = useCard();

  useEffect(() => {
    if (!card?.tasks) return;

    setTasks(card?.tasks);
  }, [card?.tasks]);

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

  const onSubmit = async (data: CreateCardForm) => {
    editCard(
      { body: { ...data, tasks }, id: card.id },
      {
        onSuccess: (data) => {
          const formData = new FormData();

          imgFiles?.forEach((file) => {
            formData.append("img", file);
          });
          textFils?.forEach((file) => {
            formData.append("txt", file);
          });

          formData.append("cardId", card.id);

          addFile(formData);

          if (fileToDelete.length > 0)
            removeFiles({ id: card.id, files: fileToDelete });

          toast.success(data.message);
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
        <p className="mt-1 text-sm text-muted-foreground">Edytuj kartę</p>
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
        attachemnts={card?.attachments}
        members={cardMemebrs?.map((el: any) => ({
          id: el.userId,
          name: el.user.name,
        }))}
        type="edit"
        onSubmit={onSubmit}
        onFileDelete={setFileToDelete}
        defaults={{
          title: card?.title,
          description: card?.description,
          dueDate: formatDateTimeLocal(card.dueDate),
          priority: card?.priority,
          userIds: card.members.filter((el: any) =>
            ["MEMEBR"].includes(el.role),
          ),
        }}
      />
    </div>
  );
}
