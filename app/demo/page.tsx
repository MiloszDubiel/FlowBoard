import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { DemoForm } from "@/components/demo/DemoForm";

export default function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center w-96 px-4 py-8">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <LogIn className="size-7 text-primary" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Witaj w wersji demonstracyjnej FlowBoard
            </CardTitle>

            <CardDescription>
              Kliknij poniższy przycisk, aby przetestować wszystkie funkcje
              FlowBoard.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <DemoForm />
        </CardContent>
      </Card>
    </section>
  );
}
