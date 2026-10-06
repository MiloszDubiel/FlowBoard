import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

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
              Witaj ponownie
            </CardTitle>

            <CardDescription>
              Zaloguj się do swojego konta FlowBoard
            </CardDescription>
          </div>
        </CardHeader>

        <LoginForm />
      </Card>
    </section>
  );
}
