import { ShieldX } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="flex min-h-75 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <ShieldX size={32} />
      </div>

      <h1 className="text-2xl font-semibold">Brak uprawnień</h1>

      <p className="max-w-md text-sm text-muted-foreground">
        Nie masz uprawnień do wyświetlenia tej zawartości. Skontaktuj się z
        administratorem, aby uzyskać dostęp.
      </p>
    </div>
  );
}
