"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MoreHorizontal,
  Tag,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CardDetails({ card }: any) {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Wróć
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardHeader>
            <div className="space-y-3">
              <Badge variant="secondary">{card.list.name}</Badge>

              <h1 className="text-3xl font-bold tracking-tight">
                {card.title}
              </h1>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <section>
              <h2 className="mb-3 text-sm font-semibold">Opis</h2>

              {card.description ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {card.description}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  Bez opisu.
                </p>
              )}
            </section>

            <Separator />

            <section>
              <h2 className="mb-4 text-sm font-semibold">Aktywności</h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Miłosz</span> moved this
                      card to{" "}
                      <span className="font-medium">{card.list.name}</span>
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator />
            <section>
              <h2 className="mb-4 text-sm font-semibold">Załączniki</h2>
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex flex-wrap gap-3">
                  {card.attachments?.map((image: any) => (
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      <a href={image.fileUrl} download>
                        <img
                          src={image.fileUrl}
                          alt="Załączone zdjęcie"
                          className="h-full w-full object-cover"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="mb-4 text-sm font-semibold">Komentarze</h2>

              <div className="space-y-4">
                {card.comments?.map((comment: any) => (
                  <div key={comment.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {comment.user?.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {comment.user?.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {comment.content}
                    </p>

                    {comment.attachments?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {comment.attachments.map((attachment: any) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="overflow-hidden rounded-md border"
                          >
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="h-24 w-24 object-cover transition hover:opacity-80"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border p-4">
                <textarea
                  placeholder="Napisz komentarz..."
                  className="min-h-24 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />

                <div className="mt-3 flex justify-end">
                  <Button size="sm">Dodaj komentarz</Button>
                </div>
              </div>
            </section>

            <Separator />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Więcej infromacji</h2>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">List</p>
                  <p className="text-sm font-medium">{card.list.name}</p>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">Członkowie</p>

                  {card.members?.length ? (
                    <div className="mt-2 space-y-2">
                      {card.members.map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {member.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <span className="text-sm">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">Brak członków zadania</p>
                  )}
                </div>
              </div>

              {/* Labels */}
              <div className="flex items-start gap-3">
                <Tag className="mt-0.5 h-4 w-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">Labels</p>

                  {card.labels?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {card.labels.map((label: any) => (
                        <Badge key={label.id} variant="secondary">
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">Brak labels</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">Utworzono</p>

                  <p className="text-sm">
                    {card.createdAt
                      ? new Date(card.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 pt-6">
              <Button variant="outline" className="w-full">
                Edytuj
              </Button>

              <Button variant="destructive" className="w-full">
                Usuń
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
