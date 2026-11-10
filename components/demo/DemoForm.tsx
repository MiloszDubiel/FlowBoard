"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "../Spinner";

export const DemoForm = () => {
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/demo");

      return data;
    },
    onSuccess: () => {
      toast.success("Sesja demonstracyjna rozpoczęta!");
      router.push("/projects");
    },
  });

  return (
    <Button
      type="submit"
      disabled={isPending || isSuccess}
      className="cursor-pointer h-11 w-full"
      onClick={() => mutate()}
    >
      {isPending ? (
        <Spinner text="Tworzenie sesji..." />
      ) : (
        "Utwórz sesję demonstracyjną"
      )}
    </Button>
  );
};
