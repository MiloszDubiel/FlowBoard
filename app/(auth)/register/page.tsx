import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="flex min-h-screen items-center justify-center w-96 px-4 py-8">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <UserPlus className="size-7 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Utwórz konto
            </CardTitle>

            <CardDescription>
              Dołącz do FlowBoard i zacznij organizować swoje projekty
            </CardDescription>
          </div>
        </CardHeader>

        <RegisterForm />
      </Card>
    </section>
  );
}
