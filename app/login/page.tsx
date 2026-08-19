import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-cente px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Witaj </CardTitle>
          <CardDescription>Zaloguj się w FlowBoard</CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </section>
  );
}
