
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-cente px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Witaj </CardTitle>
          <CardDescription>Zarejestruj się w FlowBoard</CardDescription>
        </CardHeader>

        <RegisterForm />
      </Card>
    </main>
  );
}
