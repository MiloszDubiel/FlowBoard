import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { ProfileTypes } from "@/schema/editUser.schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const Profile = ({ user }: any) => {
  const { register, reset, handleSubmit } = useForm<ProfileTypes>({
    defaultValues: {
      firstName: user?.name,
      lastName: user?.lastName,
      bio: user?.bio,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setFile(file);
  };

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user?.name,
      lastName: user?.lastname,
      bio: user?.bio,
    });
  }, [user]);

  const { mutate } = useMutation({
    mutationFn: async (body: any) => {
      const formData = new FormData();

      if (file) formData.append("img", file);

      formData.append("firstName", body.firstName);
      formData.append("lastName", body.lastName);
      formData.append("bio", body.bio);

      const { data } = await axios.patch("/api/settings/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Zarządzaj swoimi danymi osobowymi.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage
              src={preview ?? user?.avatarUrl ?? ""}
              alt={user?.name ?? "Zdjęcie profilowe"}
              className="object-cover"
            />

            <AvatarFallback className="bg-primary/10 text-xl text-primary">
              {user?.name?.slice(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium">Zdjęcie profilowe</p>

            <p className="text-xs text-muted-foreground">
              JPG lub PNG, maksymalnie 5 MB.
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="mt-2 text-sm"
            />
          </div>
        </div>

        <Separator />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Imię</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Podaj imię"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input
              id="lastName"
              placeholder="Podaj nazwisko"
              {...register("lastName")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Opis profilu</Label>
          <Textarea
            id="bio"
            placeholder="Napisz kilka słów o sobie..."
            className="min-h-28 resize-y"
            {...register("bio")}
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSubmit((data) => mutate(data))}>
            <Save className="mr-2 size-4" />
            Zapisz zmiany
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
