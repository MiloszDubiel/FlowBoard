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
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { FieldError } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
type LabelType = {
  id: number;
  name: string;
  color: string;
};

import { type CreateCardForm, createCardSchema } from "@/schema/addcard.schema";
import { toast } from "sonner";
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
}: any) {
  const {
    currentTasks,
    setCurrentTasks,
    addTask,
    tasks,
    setImgFiles,
    setTextFiles,
    removeTask,
  } = config;

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<number[]>(selectedLabels);
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3B82F6");
  const [labelFromDb, _] = useState(labels);




  const [newLabels, setNewLabels] = useState<
    Pick<LabelType, "name" | "color">[]
  >([]);

  useEffect(() => {
    setSelectedUsers(defaults.userIds);
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCardForm>({
    resolver: zodResolver(createCardSchema),
    defaultValues: defaults,
  });

  return (
    <form className="space-y-8">
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

        <div>
          <h2 className="text-lg font-semibold">Etykiety</h2>
          <p className="text-sm text-muted-foreground">
            Wybierz etykiety, które opisują tę kartę.
          </p>
        </div>

        <Popover>
          <PopoverTrigger>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start font-normal"
            >
              {selectedLabel.length > 0
                ? `${selectedLabel.length} wybranych etykiet`
                : "Wybierz etykiety..."}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-75 p-0" align="start">
            <Command>
              <CommandInput placeholder="Szukaj etykiety..." />

              <CommandList>
                <CommandEmpty>Nie znaleziono etykiety.</CommandEmpty>

                <CommandGroup heading="Dostępne etykiety">
                  {labels?.map((item: any) => {
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

                        <span
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />

                        {item.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {!isCreatingLabel ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsCreatingLabel(true)}
          >
            + Utwórz etykietę
          </Button>
        ) : (
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">Nowa etykieta</h3>

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
                {[
                  "#EF4444",
                  "#F97316",
                  "#EAB308",
                  "#22C55E",
                  "#06B6D4",
                  "#3B82F6",
                  "#8B5CF6",
                  "#EC4899",
                  "#64748B",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewLabelColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      newLabelColor === color
                        ? "border-foreground ring-2 ring-ring ring-offset-2"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Wybierz kolor ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-sm font-medium text-white"
                style={{ backgroundColor: newLabelColor }}
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
                      (el: any) =>
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
            <p className="text-sm font-medium">Utworzone etykiety</p>

            <div className="space-y-2">
              {newLabels.map((label, index) => (
                <div
                  key={`${label.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: label.color }}
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
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Usuń etykietę ${label.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {labels
            ?.filter((label: LabelType) => selectedLabels.includes(label.id))
            ?.map((label: LabelType) => (
              <div
                key={label.id}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedLabels((current) =>
                      current.filter((id) => id !== label.id),
                    )
                  }
                  className="ml-1 text-muted-foreground hover:text-destructive"
                  aria-label={`Usuń etykietę ${label.name}`}
                >
                  ×
                </button>
              </div>
            ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Termin wykonania</Label>

          <Input id="dueDate" type="datetime-local" {...register("dueDate")} />

          <FieldError errors={[errors.dueDate]} />
        </div>
      </div>

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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
          />

          <Button type="button" onClick={() => addTask()}>
            Dodaj
          </Button>
        </div>

        <div className="space-y-2">
          {tasks?.length > 0 ? (
            tasks.map((task: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border bg-background">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                </div>

                <span className="flex-1 text-sm font-medium">{task.name}</span>

                <button
                  type="button"
                  onClick={() => removeTask(index)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Usuń zadanie ${task.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
          defaultFiles={attachemnts?.filter((el: any) => el.fileType === "IMG")}
          onFileDelete={onFileDelete}
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
          onFileDelete={onFileDelete}
          defaultFiles={attachemnts?.filter(
            (el: any) => el.fileType === "TEXTFILE",
          )}
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
            <PopoverTrigger>
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
              >
                <span className="text-muted-foreground">
                  {selectedUsers?.length > 0
                    ? `${selectedUsers.length} wybranych`
                    : "Wybierz użytkowników..."}
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-75 p-0" align="start">
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

                          {member.name}
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

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline" onClick={() => {}}>
          Anuluj
        </Button>

        <Button
          type="button"
          onClick={handleSubmit((data) =>
            onSubmit({
              ...data,
              userIds: selectedUsers,
              newLabels,
              selectedLabels,
            }),
          )}
        >
          {type === "edit" ? "Edytuj" : "Utwórz kartę"}
        </Button>
      </div>
    </form>
  );
}
