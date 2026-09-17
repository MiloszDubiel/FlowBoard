"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-09-25T18:00:00+02:00").getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (TARGET_DATE: number): TimeLeft => {
  const difference = TARGET_DATE - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default function CountdownTimer({ target }: { target: number }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <TimeUnit value={timeLeft.days} label="dni" />

      <span className="text-muted-foreground">:</span>

      <TimeUnit value={timeLeft.hours} label="godz." />

      <span className="text-muted-foreground">:</span>

      <TimeUnit value={timeLeft.minutes} label="min." />

      <span className="text-muted-foreground">:</span>

      <TimeUnit value={timeLeft.seconds} label="sek." />
    </div>
  );
}
const format = (value: number) => value.toString().padStart(2, "0");
function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="font-mono text-sm font-semibold tabular-nums">
        {format(value)}
      </span>
      <span className="text-xs text-muted-foreground"> {label} </span>
    </div>
  );
}
