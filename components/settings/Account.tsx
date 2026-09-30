import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { AccountTypes, type accountSchema } from "../../schema/editUser.schema";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import ConfirmModal from "../modals/ConfirmModal";
import { useRouter } from "next/navigation";

export const Account = ({ user }: any) => {
  const { register, reset, handleSubmit } = useForm<AccountTypes>({
    defaultValues: {
      email: user?.email,
    },
  });

  const router = useRouter();
  const [editEmail, setEditEmail] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    reset({
      email: user?.email,
    });
  }, [user]);

  const { mutate } = useMutation({
    mutationFn: async (body: { email: string }) => {
      const { data } = await axios.patch("api/settings/account", { body });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`api/settings/account/${user.id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Konto</CardTitle>
          <CardDescription>
            Zarządzaj swoim kontem i jego statusem.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Adres e-mail</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input {...register("email")} disabled={editEmail} />
              <Button
                variant="outline"
                onClick={() => {
                  setEditEmail((prev) => !prev);
                }}
              >
                Zmień e-mail
              </Button>
              <Button onClick={handleSubmit((data) => mutate(data))}>
                Zapisz
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-medium">Usuń konto</h3>
            <p className="text-sm text-muted-foreground">
              Trwale usuń konto i powiązane z nim dane. Tej operacji nie można
              cofnąć.
            </p>
            <Button variant="destructive" onClick={() => setIsOpen(true)}>
              <Trash2 className="mr-2 size-4" />
              Usuń konto
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Usunąć?"
        message="Czy na pewno checsz usunąć swoje konto?"
        onCancel={() => setIsOpen(false)}
        onSubmit={() => {
          deleteUser();
          setIsOpen(false);
          router.replace("/");
        }}
      />
    </>
  );
};
