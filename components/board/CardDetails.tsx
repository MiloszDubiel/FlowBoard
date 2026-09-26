"use client";
import axios from "axios";
import {
  CheckSquare,
  Paperclip,
  FileText,
  MessageSquare,
  Clock,
  CalendarDays,
  Tag,
  Users,
  Image as ImageIcon,
  File,
  Download,
  ArrowLeft,
} from "lucide-react";
import CountdownTimer from "../CalculateTimeLeft";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { commentSchema, type CommentType } from "@/schema/addComment.schema";
import { useEffect, useMemo, useState } from "react";
import { type MembershipRole, ROLES } from "@/lib/roles";
import ConfirmModal from "../modals/ConfirmModal";
import { useCard } from "@/mutations/dashboard/useCard";
import { DragDrop } from "../DragDropFile";

const safeParseTasks = (tasks: any): any[] => {
  if (!tasks) return [];

  try {
    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks;
  } catch {
    return [];
  }
};

export default function CardDetails({ card, boardId, role }: any) {
  const router = useRouter();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  const { addComment, changeChecklist, deleteCard, addFileToComment } =
    useCard();

  const findRole = (userId: number) => {
    return card?.list?.board.members.find((el: any) => el.userId === userId)
      ?.role;
  };

  const [parsedTasks, setParsedTasks] = useState<any[]>([]);
  const attachments = card?.attachments ?? [];

  const imagesFiles = useMemo(
    () =>
      attachments.filter((attachment: any) => attachment.fileType === "IMG"),
    [attachments],
  );

  console.log(card);

  const textFiles = useMemo(
    () =>
      attachments.filter(
        (attachment: any) => attachment.fileType === "TEXTFILE",
      ),
    [attachments],
  );

  useEffect(() => {
    const tasks = safeParseTasks(card.tasks);
    setParsedTasks(tasks);
  }, [card?.tasks]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentType>({
    defaultValues: {
      comment: "",
    },
    resolver: zodResolver(commentSchema),
  });

  const handleAddComment = (comment: CommentType) => {
    addComment.mutate(
      { newComment: comment, id: Number(card.id) },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.refresh();
          const formData = new FormData();

          files?.forEach((file) => {
            formData.append("files", file);
          });

          addFileToComment.mutate({
            body: formData,
            cardId: card.id,
            commentId: data.commentId,
          });
          toast.success(data.message);
          reset();
        },
      },
    );
  };

  return (
    <main className="min-h-screen overflow-auto bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-8">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.replace(`/projects/board/${boardId}`)}
                className="group -ml-2 gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Powrót do boardu</span>
              </Button>
            </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />

                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  Opis
                </h2>
              </div>

              <div className="rounded-xl border bg-card p-5 shadow-sm">
                {card.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-7">
                    {card.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Brak opisu.</p>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-muted-foreground" />

                  <h2 className="text-sm font-semibold uppercase tracking-wide">
                    Checklista
                  </h2>
                </div>

                <span className="text-xs text-muted-foreground">
                  {parsedTasks.filter((task) => task.isCompleted).length} /{" "}
                  {parsedTasks.length}
                </span>
              </div>

              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="space-y-1">
                  {parsedTasks.length > 0 ? (
                    parsedTasks.map((task: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/50"
                      >
                        <Checkbox
                          id={`task-${index}`}
                          checked={task.isCompleted}
                          disabled={role === "MEMBER"}
                          onCheckedChange={(checked) =>
                            setParsedTasks((tasks) =>
                              tasks.map((currentTask) =>
                                currentTask.name === task.name
                                  ? {
                                      ...currentTask,
                                      isCompleted: checked === true,
                                    }
                                  : currentTask,
                              ),
                            )
                          }
                        />

                        <label
                          htmlFor={`task-${index}`}
                          className={`text-sm font-medium ${
                            task.isCompleted
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {task.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Brak elementów checklisty.
                    </p>
                  )}
                </div>

                {role !== "MEMBER" && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() =>
                          changeChecklist.mutate(
                            {
                              newList: parsedTasks,
                              id: Number(card.id),
                            },
                            {
                              onSuccess: (data) => {
                                toast.success(data.message);
                              },
                            },
                          )
                        }
                      >
                        Zapisz
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-muted-foreground" />

                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  Załączniki
                </h2>

                {attachments.length > 0 && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {attachments.length}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {imagesFiles.length > 0 && (
                  <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />

                      <h3 className="text-sm font-semibold">Zdjęcia</h3>

                      <span className="text-xs text-muted-foreground">
                        ({imagesFiles.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {imagesFiles.map((attachment: any) => (
                        <a
                          key={attachment.id ?? attachment.fileName}
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="relative aspect-square overflow-hidden bg-muted">
                            <img
                              src={attachment.fileUrl}
                              alt={attachment.fileName ?? "Zdjęcie"}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                              <ImageIcon className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-3">
                            <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />

                            <span className="truncate text-xs font-medium">
                              {attachment.fileName}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {textFiles.length > 0 && (
                  <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />

                      <h3 className="text-sm font-semibold">Pliki</h3>

                      <span className="text-xs text-muted-foreground">
                        ({textFiles.length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {textFiles.map((attachment: any) => (
                        <div
                          key={attachment.id ?? attachment.fileName}
                          className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {attachment.fileName}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Plik
                            </p>
                          </div>

                          <a
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Otwórz plik"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {attachments.length === 0 && (
                  <div className="rounded-xl border border-dashed bg-card py-12 text-center">
                    <Paperclip className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />

                    <p className="text-sm font-medium">Brak załączników</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Do tej karty nie dodano jeszcze żadnych zdjęć ani plików.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />

                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  Komentarze
                </h2>

                {card.comments?.length > 0 && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {card.comments.length}
                  </span>
                )}
              </div>
              <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <textarea
                  placeholder="Napisz komentarz..."
                  className="min-h-32 w-full resize-none bg-transparent p-4 text-sm outline-none placeholder:text-muted-foreground"
                  {...register("comment")}
                />

                <div className="flex flex-col items-end justify-between border-t px-4 py-3 gap-4">
                  <DragDrop
                    onFileChange={(file: File[]) => setFiles(file)}
                    fileSize={5}
                    type="img"
                    onFileDelete={new Function()}
                  />

                  <Button
                    size="sm"
                    onClick={handleSubmit(handleAddComment, (err) =>
                      console.log(err),
                    )}
                  >
                    Dodaj komentarz
                  </Button>
                </div>

                <FieldError errors={[errors.comment]} />
              </div>

              <div className="space-y-6">
                {card.comments?.length > 0 ? (
                  card.comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage
                          src={comment.user.avatarUrl ?? undefined}
                        />

                        <AvatarFallback>
                          {comment.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {comment.user.name}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString(
                              "pl-PL",
                            )}
                          </span>
                        </div>

                        <div className="rounded-xl border bg-card px-4 py-3.5 shadow-sm">
                          <p className="whitespace-pre-wrap text-sm leading-6">
                            {comment.content}
                          </p>
                        </div>

                        {comment.commentAttachments?.length > 0 && (
                          <div className="mt-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                              {comment.commentAttachments.map(
                                (attachment: any) => {
                                  return (
                                    <a
                                      key={attachment.id}
                                      href={attachment.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group relative overflow-hidden rounded-xl border bg-muted/30"
                                    >
                                      <img
                                        src={attachment.fileUrl}
                                        alt={attachment.fileName}
                                        className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                      />

                                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
                                        <p className="truncate text-xs font-medium text-white">
                                          {attachment.fileName}
                                        </p>
                                      </div>
                                    </a>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed py-10 text-center">
                    <MessageSquare className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />

                    <p className="text-sm font-medium">Brak komentarzy</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Bądź pierwszą osobą, która doda komentarz.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-xl border bg-card shadow-sm">
              <section className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />

                  <h3 className="text-sm font-semibold">Członkowie</h3>
                </div>

                <div className="space-y-3">
                  {card.members?.length > 0 ? (
                    card.members.map((member: any) => (
                      <div
                        key={`member-${member.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl ?? undefined} />

                          <AvatarFallback>
                            {member.user?.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {member.user?.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {
                              ROLES[
                                findRole(
                                  Number(member.userId),
                                ) as MembershipRole
                              ]
                            }
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Brak członków
                    </p>
                  )}
                </div>
              </section>

              <Separator />

              <section className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />

                  <h3 className="text-sm font-semibold">Etykiety</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {card.labels?.length > 0 ? (
                    card.labels.map((item: any) => (
                      <span
                        key={item.label.id}
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${item.label.color}20`,
                          color: item.label.color,
                          border: `1px solid ${item.label.color}40`,
                        }}
                      >
                        {item.label.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Brak etykiet
                    </span>
                  )}
                </div>
              </section>

              <Separator />

              <section className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Termin</h3>
                </div>
                {card?.dueDate ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Termin zakończenia
                        </span>
                        <span className="text-sm font-medium">
                          {new Date(card.dueDate).toLocaleString("pl-PL", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Pozostało
                        </span>
                      </div>
                      <div className="pl-0">
                        <CountdownTimer
                          target={new Date(card.dueDate).getTime()}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Brak terminu
                    </span>
                  </div>
                )}
              </section>

              <Separator />

              <section className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />

                  <h3 className="text-sm font-semibold">Załączniki</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />

                      <span className="text-sm text-muted-foreground">
                        Zdjęcia
                      </span>
                    </div>

                    <span className="text-sm font-medium">
                      {imagesFiles.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />

                      <span className="text-sm text-muted-foreground">
                        Pliki
                      </span>
                    </div>

                    <span className="text-sm font-medium">
                      {textFiles.length}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Razem</span>

                    <span className="text-sm font-semibold">
                      {attachments.length}
                    </span>
                  </div>
                </div>
              </section>

              <Separator />

              <section className="p-5">
                <h3 className="mb-4 text-sm font-semibold">Informacje</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Utworzono</span>

                    <span>
                      {card.createdAt
                        ? new Date(card.createdAt).toLocaleDateString("pl-PL")
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Zaktualizowano
                    </span>

                    <span>
                      {card.updatedAt
                        ? new Date(card.updatedAt).toLocaleDateString("pl-PL")
                        : "-"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
            {["ADMIN", "OWNER"].includes(role) && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="w- mt-2"
                  onClick={() =>
                    router.replace(
                      `/projects/board/${boardId}/card/edit-card/${card.id}`,
                    )
                  }
                >
                  Edytuj
                </Button>
                <Button
                  variant="destructive"
                  className="w- mt-2"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Usuń kartę
                </Button>
              </div>
            )}
          </aside>
          <ConfirmModal
            open={isDeleteModalOpen}
            onCancel={() => {
              setDeleteModalOpen(false);
            }}
            onSubmit={() => {
              deleteCard.mutate(Number(card.id), {
                onSuccess: (data) => {
                  toast.success(data.message);
                  router.replace(`/projects/board/${boardId}`);
                },
                onError: (error) => {
                  if (axios.isAxiosError(error)) {
                    toast.error(
                      error.response?.data?.message ?? "Wystąpił błąd",
                    );
                  }
                },
              });
            }}
            onOpenChange={setDeleteModalOpen}
            message="Czy na pewno chcesz usunąc kartę? "
            title="Czy usunąć"
          />
        </div>
      </div>
    </main>
  );
}
