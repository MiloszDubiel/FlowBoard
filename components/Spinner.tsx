import { Loader2 } from "lucide-react";

export const Spinner = ({ text }: { text: string }) => {
  return (
    <span className="flex justify-center items-center">
      <Loader2 className="mr-2 size-4 animate-spin" /> {text}
    </span>
  );
};
