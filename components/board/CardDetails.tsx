import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  Tag,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function CardDetails({ card, boardId }: any) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <a href={`/dashboard/board/${boardId}`}>
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>

          <div>
            <p className="text-sm text-muted-foreground">{card.list?.name}</p>

            <h1 className="text-2xl font-semibold">{card.title}</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />

                <h2 className="text-lg font-semibold">Opis</h2>
              </div>

              <div className="rounded-xl border bg-card p-5">
                {card.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-7">
                    {card.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Brak opisu.</p>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />

                <h2 className="text-lg font-semibold">Opis</h2>
              </div>

              <div className="rounded-xl border bg-card p-5">
                {card.attachments?.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {card.attachments.map((attachment: any) => (
                      <a
                        key={attachment.fileName}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group overflow-hidden rounded-lg border"
                      >
                        <img
                          src={attachment.fileUrl}
                          alt={attachment.fileName ?? "Załącznik"}
                          className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />

                <h2 className="text-lg font-semibold">Komentarze</h2>
              </div>

              <div className="rounded-xl border bg-card p-5">
                <textarea
                  placeholder="Napisz komentarz..."
                  className="min-h-28 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />

                <div className="mt-4 flex justify-end">
                  <Button>Dodaj komentarz</Button>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {card.comments?.length > 0 ? (
                  card.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={comment.user.avatarUrl ?? undefined}
                        />

                        <AvatarFallback>
                          {comment.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {comment.user.name}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString(
                              "pl-PL",
                            )}
                          </span>
                        </div>

                        <div className="rounded-xl border bg-card p-4 text-sm">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Brak komentarzy.
                  </p>
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-6 rounded-xl border bg-card p-5">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />

                <h3 className="text-sm font-semibold">Członkowie</h3>
              </div>

              <div className="space-y-3">
                {card.members?.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl ?? undefined} />

                      <AvatarFallback>
                        {member.user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4" />

                <h3 className="text-sm font-semibold">Etykiety</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {card.labels?.length > 0 ? (
                  card.labels.map((label: any) => (
                    <Badge
                      key={label.id}
                      style={{
                        backgroundColor: label.color,
                      }}
                      className="text-white"
                    >
                      {label.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Brak etykiet
                  </span>
                )}
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />

                <h3 className="text-sm font-semibold">Termin</h3>
              </div>

              {card.dueDate ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm">
                    {new Date(card.dueDate).toLocaleString("pl-PL")}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Brak terminu
                </span>
              )}
            </section>

            <Separator />

            <section>
              <div className="mb-4 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />

                <h3 className="text-sm font-semibold">Załączniki</h3>
              </div>

              <Button variant="outline" className="w-full">
                <Paperclip className="mr-2 h-4 w-4" />
                Dodaj załącznik
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
