"use client";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type CreateCardForm, createCardSchema } from "@/schema/addcard.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "../ui/select";
import { DragDrop } from "../DragDropFile";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface CreateCardModalProps {
  listId: number;
  members: any[];
  boardId: number;
}
type Task = {
  name: string;
  isCompleted: boolean;
};
import { FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCard } from "@/mutations/dashboard/useCard";

export default function AddCard({
  listId,
  members = [],
  boardId,
}: CreateCardModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCardForm>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      userIds: [],
    },
  });

  const route = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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

  const onSubmit = async (data: CreateCardForm) => {
    addCard(
      { ...data, userIds: selectedUsers, listId, tasks },
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
      reset({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
        userIds: [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container max-w-3xl px-4 py-8 w-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Utwórz kartę</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Utwórz nową kartę i przypisz do niej użytkowników.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="space-y-8"
      >
        <div className="space-y-5 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Informacje podstawowe</h2>
            <p className="text-sm text-muted-foreground">
              Podaj podstawowe informacje dotyczące karty.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tytuł</Label>

            <Input
              id="title"
              placeholder="Nazwa karty..."
              {...register("title")}
            />

            <FieldError errors={[errors.title]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>

            <Textarea
              id="description"
              placeholder="Dodaj opis..."
              className="min-h-25"
              {...register("description")}
            />

            <FieldError errors={[errors.description]} />
          </div>

          <div className="space-y-2">
            <Label>Priorytet</Label>

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wybierz priorytet" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="LOW">Niski</SelectItem>
                      <SelectItem value="MEDIUM">Średni</SelectItem>
                      <SelectItem value="HIGH">Wysoki</SelectItem>
                      <SelectItem value="URGENT">Pilny</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError errors={[errors.priority]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Termin wykonania</Label>

            <Input
              id="dueDate"
              type="datetime-local"
              {...register("dueDate")}
            />

            <FieldError errors={[errors.dueDate]} />
          </div>
        </div>

        {/* Zadania */}
        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Zadania</h2>
            <p className="text-sm text-muted-foreground">
              Dodaj zadania, które należy wykonać w ramach karty.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              id="task"
              placeholder="Nazwa zadania..."
              value={currentTasks}
              onChange={(e) => setCurrentTasks(e.target.value)}
            />

            <Button type="button" onClick={() => addTask()}>
              Dodaj
            </Button>
          </div>

          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border bg-background">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  </div>
                  <span className="flex-1 text-sm font-medium">
                    {task.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                Brak zadań
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Zdjęcia</h2>
            <p className="text-sm text-muted-foreground">
              Dodaj zdjęcia związane z kartą.
            </p>
          </div>

          <DragDrop
            onFileChange={(file: File[]) => setImgFiles(file)}
            fileSize={5}
            type="img"
          />
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Pliki</h2>
            <p className="text-sm text-muted-foreground">
              Dodaj zdjęcia związane z kartą.
            </p>
          </div>

          <DragDrop
            onFileChange={(file: File[]) => setTextFiles(file)}
            fileSize={5}
            type="text"
          />
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Przypisani użytkownicy</h2>
            <p className="text-sm text-muted-foreground">
              Wybierz użytkowników, którzy będą pracować nad kartą.
            </p>
          </div>

          <div className="min-h-10 rounded-md border p-2">
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    <span className="text-muted-foreground">
                      {selectedUsers.length > 0
                        ? `${selectedUsers.length} wybranych`
                        : "Wybierz użytkowników..."}
                    </span>
                  </Button>
                }
              />

              <PopoverContent className="w-75 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Szukaj użytkownika..." />

                  <CommandList>
                    <CommandEmpty>Nie znaleziono użytkownika.</CommandEmpty>

                    <CommandGroup heading="Użytkownicy">
                      {members.map((member) => {
                        const isSelected = selectedUsers.includes(
                          member.user.id,
                        );

                        return (
                          <CommandItem
                            key={member.user.id}
                            value={member.user.name}
                            onSelect={() => {
                              setSelectedUsers((current) =>
                                isSelected
                                  ? current.filter(
                                      (id) => id !== member.user.id,
                                    )
                                  : [...current, member.user.id],
                              );
                            }}
                          >
                            <div
                              className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              }`}
                            >
                              {isSelected && "✓"}
                            </div>

                            {member.user.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Przyciski */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Button type="button" variant="outline" onClick={() => {}}>
            Anuluj
          </Button>

          <Button type="submit">Utwórz kartę</Button>
        </div>
      </form>
    </div>
  );
}
