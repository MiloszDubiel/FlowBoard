import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Spinner text="Trwa ładowanie" />
    </div>
  );
}
