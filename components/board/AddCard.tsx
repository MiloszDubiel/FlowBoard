"use client";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: number;
  members: any[];
}
import { FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCard } from "@/mutations/dashboard/useCard";

export default function CreateCardModal({
  open,
  onOpenChange,
  listId,
  members = [],
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
  const [files, setFiles] = useState<File[]>([new File([""], "Cos")]);

  const {
    addFile: { mutate: addFile },
    addCard: { mutate: addCard },
  } = useCard();

  const onSubmit = async (data: CreateCardForm) => {
    console.log(files);

    addCard(
      { ...data, userIds: selectedUsers, listId },
      {
        onSuccess: (data) => {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("cardId", data.cardId);
          0;
          addFile(formData);
          toast.success(data.message);
          route.refresh();
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
      // onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 ">
        <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
          <DialogHeader>
            <DialogTitle>Utwórz kartę</DialogTitle>
            <DialogDescription>
              Utwórz nową kartę i przypisz do niej użytkowników.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
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
              <Label>Zdjecia</Label>
              <DragDrop onFileChange={(file: File[]) => setFiles(file)} />
            </div>

            <div className="space-y-2">
              <Label>Przypisani użytkownicy</Label>

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
                  ></PopoverTrigger>

                  <PopoverContent className="w-75 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Szukaj użytkownika..." />

                      <CommandList>
                        <CommandEmpty>Nie znaleziono użytkownika.</CommandEmpty>
                        <CommandGroup heading="Użytkownicy">
                          {members.map((member) => {
                            const isSelected = selectedUsers.includes(
                              member.id,
                            );
                            return (
                              <CommandItem
                                key={member.id}
                                value={member.name}
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
                                  className={`
                                  "mr-2 flex h-2 w-2 items-center justify-center rounded-sm border",
                                  ${isSelected && "bg-primary text-primary-foreground"},
                                `}
                                ></div>

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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Anuluj
            </Button>

            <Button type="submit">Utwórz kartę</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
