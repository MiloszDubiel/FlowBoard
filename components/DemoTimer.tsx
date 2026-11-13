"use client";

import { useLogout } from "@/mutations/useLogout";
import { ClockAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type DemoTimerProps = {
  data: string | number | Date;
};

export const DemoTimer = ({ data }: DemoTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const {
    logout: { mutate: logout },
  } = useLogout();

  const router = useRouter();

  useEffect(() => {
    const countDownDate = new Date(data).getTime();

    const updateTimer = () => {
      const distance = countDownDate - Date.now();

      if (distance <= 0) {
        setTimeLeft("Sesja zakończona");
        logout();
        router.replace("/");
        return false;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );

      return true;
    };

    if (!updateTimer()) return;

    const timer = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  return (
    <div className="flex items-center justify-center gap-2  top-0 left-0 right-0 bg-amber-500/10 px-4 py-2 text-sm text-amber-600 dark:text-amber-400">
      <ClockAlert className="size-4 shrink-0" />

      <p>
        Sesja demo kończy się za{" "}
        <span className="font-semibold tabular-nums">{timeLeft}</span>
      </p>
    </div>
  );
};
