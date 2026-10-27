"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "../components/ui/select";
import { DragDrop } from "./DragDropFile";
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
import {
  Trash2,
  ChevronDown,
  Check,
  Users,
  Tag,
  CalendarDays,
  ListTodo,
  ImageIcon,
  FileText,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";

import { type CreateCardForm, createCardSchema } from "@/schema/addcard.schema";
import { toast } from "sonner";
import { projectColors } from "@/lib/colors";
import { useRouter } from "next/navigation";

import { Spinner } from "./Spinner";

type LabelType = {
  id: number;
  name: string;
  color: string;
};

export default function CardForm({
  config,
  members,
  onSubmit,
  defaults,
  type,
  attachemnts,
  labels,
  onFileDelete,
  selectedLabels,
  isPending,
  boardId,
  removeTask,
  isSuccess,
}: any) {
  const {
    currentTasks,
    setCurrentTasks,
    addTask,
    tasks,
    setImgFiles,
    setTextFiles,
  } = config;

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<number[]>(
    selectedLabels || [],
  );

  const router = useRouter();

  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3B82F6");

  const [labelFromDb] = useState(labels);

  const [newLabels, setNewLabels] = useState<
    Pick<LabelType, "name" | "color">[]
  >([]);

  useEffect(() => {
    setSelectedUsers(defaults?.userIds || []);
  }, [defaults?.userIds]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCardForm>({
    resolver: zodResolver(createCardSchema),
    defaultValues: defaults,
  });

  const selectedUsersData =
    members?.filter((member: any) => selectedUsers.includes(member.id)) || [];

  const selectedLabelsData =
    labels?.filter((label: LabelType) => selectedLabel.includes(label.id)) ||
    [];

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({
          ...data,
          userIds: selectedUsers,
          newLabels,
          selectedLabels: selectedLabel,
        });
      })}
      className="mx-auto w-full max-w-4xl space-y-6 pb-24"
    >
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-lg font-semibold">Informacje podstawowe</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Podaj podstawowe informacje dotyczące karty.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tytuł</Label>

            <Input
              id="title"
              placeholder="Nazwa karty..."
              {...register("title")}
              className="h-11"
            />

            <FieldError errors={[errors.title]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>

            <Textarea
              id="description"
              placeholder="Dodaj opis karty..."
              className="min-h-32 resize-y"
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
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Wybierz priorytet" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="LOW">
                        <span className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-green-500" />
                          Niski
                        </span>
                      </SelectItem>

                      <SelectItem value="MEDIUM">
                        <span className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-yellow-500" />
                          Średni
                        </span>
                      </SelectItem>

                      <SelectItem value="HIGH">
                        <span className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-orange-500" />
                          Wysoki
                        </span>
                      </SelectItem>

                      <SelectItem value="URGENT">
                        <span className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-red-500" />
                          Pilny
                        </span>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError errors={[errors.priority]} />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="flex items-center gap-2">
                <Tag className="size-4" />
                Etykiety
              </Label>

              <p className="mt-1 text-sm text-muted-foreground">
                Wybierz etykiety, które opisują tę kartę.
              </p>
            </div>

            <Popover>
              <PopoverTrigger>
                <div
                  className="
                    flex min-h-11 w-full items-center justify-between
                    rounded-lg border bg-background px-3 py-2
                    text-sm shadow-sm
                    transition-colors
                    hover:bg-muted/50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-ring
                  "
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {selectedLabelsData.length > 0 ? (
                      <>
                        {selectedLabelsData
                          .slice(0, 3)
                          .map((label: LabelType) => (
                            <span
                              key={label.id}
                              className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                              style={{
                                backgroundColor: label.color,
                              }}
                            >
                              {label.name}
                            </span>
                          ))}

                        {selectedLabelsData.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{selectedLabelsData.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        Wybierz etykiety...
                      </span>
                    )}
                  </div>

                  <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
                </div>
              </PopoverTrigger>

              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Szukaj etykiety..." />

                  <CommandList>
                    <CommandEmpty>Nie znaleziono etykiety.</CommandEmpty>

                    <CommandGroup heading="Dostępne etykiety">
                      {labels?.map((item: LabelType) => {
                        const isSelected = selectedLabel.includes(item.id);

                        return (
                          <CommandItem
                            key={item.id}
                            value={item.name}
                            onSelect={() => {
                              setSelectedLabel((current) =>
                                isSelected
                                  ? current.filter((id) => id !== item.id)
                                  : [...current, item.id],
                              );
                            }}
                            className="cursor-pointer"
                          >
                            <div
                              className={`
                                mr-2 flex size-4 items-center
                                justify-center rounded-sm border
                                ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/30"
                                }
                              `}
                            >
                              {isSelected && <Check className="size-3" />}
                            </div>

                            <span
                              className="mr-2 size-3 rounded-full"
                              style={{
                                backgroundColor: item.color,
                              }}
                            />

                            <span className="flex-1">{item.name}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {!isCreatingLabel ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsCreatingLabel(true)}
            >
              <Tag className="mr-2 size-4" />
              Utwórz etykietę
            </Button>
          ) : (
            <div className="space-y-5 rounded-lg border bg-muted/20 p-5">
              <div>
                <h3 className="font-medium">Nowa etykieta</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Utwórz własną etykietę dla tej karty.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelName">Nazwa etykiety</Label>

                <Input
                  id="labelName"
                  placeholder="Np. Bug, Frontend..."
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Kolor etykiety</Label>

                <div className="flex flex-wrap gap-3">
                  {projectColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewLabelColor(color.value)}
                      className={`
                        size-8 rounded-full border-2
                        transition-all
                        ${
                          newLabelColor === color.value
                            ? "border-foreground ring-2 ring-ring ring-offset-2"
                            : "border-transparent hover:scale-110"
                        }
                      `}
                      style={{
                        backgroundColor: color.value,
                      }}
                      aria-label={`Wybierz kolor ${color.color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span
                  className="inline-flex rounded-full px-3 py-1 text-sm font-medium text-white"
                  style={{
                    backgroundColor: newLabelColor,
                  }}
                >
                  {newLabelName || "Podgląd etykiety"}
                </span>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreatingLabel(false);
                    setNewLabelName("");
                    setNewLabelColor("#3B82F6");
                  }}
                >
                  Anuluj
                </Button>

                <Button
                  type="button"
                  disabled={!newLabelName.trim()}
                  onClick={() => {
                    setNewLabels((prev) => {
                      const exists = prev.some(
                        (el) =>
                          el.name.trim().toLocaleLowerCase() ===
                          newLabelName.trim().toLocaleLowerCase(),
                      );

                      const existsInDB = labelFromDb.some(
                        (el: LabelType) =>
                          el.name.trim().toLocaleLowerCase() ===
                          newLabelName.trim().toLocaleLowerCase(),
                      );

                      if (exists || existsInDB) {
                        toast.error("Etykieta już istnieje");
                        return prev;
                      }

                      return [
                        ...prev,
                        {
                          name: newLabelName.trim(),
                          color: newLabelColor,
                        },
                      ];
                    });

                    setNewLabelName("");
                    setNewLabelColor("#3B82F6");
                  }}
                >
                  Utwórz
                </Button>
              </div>
            </div>
          )}

          {newLabels.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Nowe etykiety</p>

              <div className="space-y-2">
                {newLabels.map((label, index) => (
                  <div
                    key={`${label.name}-${index}`}
                    className="
                      flex items-center justify-between
                      rounded-lg border bg-background
                      px-3 py-2
                    "
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{
                          backgroundColor: label.color,
                        }}
                      />

                      <span className="text-sm font-medium">{label.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNewLabels((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                      className="
                        flex size-8 items-center justify-center
                        rounded-md text-muted-foreground
                        transition-colors
                        hover:bg-destructive/10
                        hover:text-destructive
                      "
                      aria-label={`Usuń etykietę ${label.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedLabelsData.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedLabelsData.map((label: LabelType) => (
                <div
                  key={label.id}
                  className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor: label.color,
                    }}
                  />

                  {label.name}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedLabel((current) =>
                        current.filter((id) => id !== label.id),
                      )
                    }
                    className="ml-1 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label={`Usuń etykietę ${label.name}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              Termin wykonania
            </Label>

            <Input
              id="dueDate"
              type="datetime-local"
              {...register("dueDate")}
              className="h-11"
            />

            <FieldError errors={[errors.dueDate]} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-2">
            <ListTodo className="size-5 text-primary" />

            <h2 className="text-lg font-semibold">Zadania</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Dodaj zadania, które należy wykonać w ramach karty.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex gap-2">
            <Input
              placeholder="Dodaj nowe zadanie..."
              value={currentTasks}
              onChange={(e) => setCurrentTasks(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setCurrentTasks("");
                  addTask();
                }
              }}
            />

            <Button
              type="button"
              onClick={() => {
                addTask();
                setCurrentTasks("");
              }}
              className="shrink-0"
            >
              Dodaj
            </Button>
          </div>

          <div className="space-y-2">
            {tasks?.length > 0 ? (
              tasks.map((task: any, index: number) => (
                <div
                  key={index}
                  className="
                    group flex items-center gap-3
                    rounded-lg border bg-background
                    px-4 py-3
                    transition-colors
                    hover:bg-muted/40
                  "
                >
                  <div className="flex size-5 shrink-0 items-center justify-center rounded border">
                    <div className="size-2 rounded-full bg-muted-foreground/40" />
                  </div>

                  <span className="flex-1 text-sm font-medium">
                    {task.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="
                      flex size-8 shrink-0 items-center
                      justify-center rounded-md
                      text-muted-foreground
                      transition-all
                   
                      hover:bg-destructive/10
                      hover:text-destructive
                    "
                    aria-label={`Usuń zadanie ${task.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed py-8 text-center">
                <ListTodo className="mx-auto size-8 text-muted-foreground/50" />

                <p className="mt-2 text-sm text-muted-foreground">Brak zadań</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Dodaj pierwsze zadanie powyżej.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" />

            <h2 className="text-lg font-semibold">Zdjęcia</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Dodaj zdjęcia związane z kartą.
          </p>
        </div>

        <div className="p-6">
          <DragDrop
            onFileChange={(file: File[]) => setImgFiles(file)}
            fileSize={5}
            type="img"
            defaultFiles={attachemnts?.filter(
              (el: any) => el.fileType === "IMG",
            )}
            onFileDelete={onFileDelete}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />

            <h2 className="text-lg font-semibold">Pliki</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Dodaj pliki związane z kartą.
          </p>
        </div>

        <div className="p-6">
          <DragDrop
            onFileChange={(file: File[]) => setTextFiles(file)}
            fileSize={5}
            type="text"
            onFileDelete={onFileDelete}
            defaultFiles={attachemnts?.filter(
              (el: any) => el.fileType === "TEXTFILE",
            )}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />

            <h2 className="text-lg font-semibold">Przypisani użytkownicy</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Wybierz osoby, które będą pracować nad kartą.
          </p>
        </div>

        <div className="p-6">
          <Popover>
            <PopoverTrigger>
              <div
                className="
                  flex min-h-11 w-full items-center
                  justify-between rounded-lg border
                  bg-background px-3 py-2
                  text-sm shadow-sm
                  transition-colors
                  hover:bg-muted/50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  {selectedUsersData.length > 0 ? (
                    <>
                      <div className="flex -space-x-2">
                        {selectedUsersData.slice(0, 4).map((member: any) => (
                          <div
                            key={member.id}
                            className="
                                flex size-7 items-center
                                justify-center rounded-full
                                border-2 border-background
                                bg-primary/10
                                text-xs font-medium
                                text-primary
                              "
                            title={member.name}
                          >
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>

                      <span className="truncate font-medium">
                        {selectedUsersData.length}{" "}
                        {selectedUsersData.length === 1
                          ? "użytkownik"
                          : "użytkowników"}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      Wybierz użytkowników...
                    </span>
                  )}
                </div>

                <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
              </div>
            </PopoverTrigger>

            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Szukaj użytkownika..." />

                <CommandList>
                  <CommandEmpty>Nie znaleziono użytkownika.</CommandEmpty>

                  <CommandGroup heading="Użytkownicy">
                    {members?.map((member: any) => {
                      const isSelected = selectedUsers.includes(member.id);

                      return (
                        <CommandItem
                          key={member.id}
                          value={member.name}
                          onSelect={() => {
                            setSelectedUsers((current) =>
                              isSelected
                                ? current.filter((id) => id !== member.id)
                                : [...current, member.id],
                            );
                          }}
                          className="cursor-pointer"
                        >
                          <div
                            className="
                              mr-2 flex size-7 shrink-0
                              items-center justify-center
                              rounded-full bg-primary/10
                              text-xs font-medium text-primary
                            "
                          >
                            {member.name?.charAt(0).toUpperCase()}
                          </div>

                          <span className="flex-1">{member.name}</span>

                          <div
                            className={`
                              flex size-4 items-center
                              justify-center rounded-sm border
                              ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/30"
                              }
                            `}
                          >
                            {isSelected && <Check className="size-3" />}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedUsersData.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedUsersData.map((member: any) => (
                <div
                  key={member.id}
                  className="
                    flex items-center gap-2 rounded-full
                    border bg-background px-3 py-1.5
                    text-sm
                  "
                >
                  <div
                    className="
                    flex size-5 items-center
                    justify-center rounded-full
                    bg-primary/10 text-[10px]
                    font-medium text-primary
                  "
                  >
                    {member.name?.charAt(0).toUpperCase()}
                  </div>

                  <span>{member.name}</span>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedUsers((current) =>
                        current.filter((id) => id !== member.id),
                      )
                    }
                    className="
                      ml-1 text-muted-foreground
                      transition-colors
                      hover:text-destructive
                    "
                    aria-label={`Usuń użytkownika ${member.name}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div
        className="
        sticky bottom-4 z-10
        flex items-center justify-between
        gap-4 rounded-xl border
        bg-background/95 p-4
        shadow-lg backdrop-blur
      "
      >
        <p className="hidden text-sm text-muted-foreground sm:block">
          Sprawdź dane przed zapisaniem karty.
        </p>

        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.replace(`/projects/board/${boardId}`);
            }}
            disabled={isPending || isSuccess}
          >
            Anuluj
          </Button>

          <Button type="submit" disabled={isPending || isSuccess}>
            {isPending ? (
              <Spinner text={"Trwa zapisywanie"} />
            ) : type === "edit" ? (
              "Zapisz zmiany"
            ) : (
              "Utwórz kartę"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
