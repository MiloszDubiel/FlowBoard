import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-scree">
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Zarządzaj projektami z{" "}
          <span className="text-blue-600">FlowBoard</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Prosta i intuicyjna aplikacja do zarządzania zadaniami, projektami i
          zespołami. Organizuj pracę tak, jak lubisz.
        </p>

        <div className="mt-8 flex gap-4">
          <Button size="lg">
            <Link href="/register">Zacznij za darmo</Link>
          </Button>
          <Button size="lg">
            <Link href="/login">Zaloguj się</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tablice</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              Nowoczesne zarządzanie projektami
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tablice</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              Organizuj zadania za pomocą przejrzystych tablic Kanban.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tablice</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              Pracuj razem z zespołem nad wspólnymi projektami.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
