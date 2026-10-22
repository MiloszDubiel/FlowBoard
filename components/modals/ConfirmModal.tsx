"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLockStore } from "@/stores/lockButton.store";

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  isPending?: boolean;
  isSuccess?: boolean;
};

const ConfirmModal = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  title,
  message,
  isPending,
  isSuccess,
}: ConfirmModalProps) => {
  const lock = useLockStore((store) => store.lock);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isPending || isSuccess}
          >
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} disabled={isPending}>
            Zatwierdź
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
