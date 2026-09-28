import Link from "next/link";
import {
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  Users,
  Zap,
  ShieldCheck,
  CalendarDays,
  Tags,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: LayoutDashboard,
    title: "Tablice Kanban",
    description:
      "Organizuj projekty za pomocą przejrzystych tablic. Przenoś zadania między kolumnami i kontroluj postępy pracy.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: ListTodo,
    title: "Zarządzanie zadaniami",
    description:
      "Twórz karty, dodawaj opisy, ustalaj priorytety i terminy realizacji. Wszystko, czego potrzebujesz, w jednym miejscu.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Users,
    title: "Współpraca zespołowa",
    warning: "W trakcie implementacji",
    description:
      "Zapraszaj członków zespołu, przypisuj zadania i wspólnie realizuj cele swoich projektów. ",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Tags,
    title: "Etykiety i priorytety",
    description:
      "Oznaczaj zadania kolorowymi etykietami i ustalaj priorytety, aby łatwiej odnajdywać najważniejsze sprawy.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: CalendarDays,
    title: "Terminy i organizacja",
    description:
      "Ustalaj terminy realizacji zadań i planuj pracę tak, aby żaden ważny obowiązek nie umknął Twojej uwadze.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: ShieldCheck,
    title: "Role i uprawnienia",
    description:
      "Zarządzaj dostępem do projektów i przydzielaj role członkom zespołu, aby każdy wiedział, za co odpowiada.",
    color: "bg-cyan-100 text-cyan-600",
  },
];

const benefits = [
  "Przejrzysta organizacja projektów",
  "Wszystkie zadania w jednym miejscu",
  "Łatwa współpraca z zespołem",
];

export default function MainPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background w-full">
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <LayoutDashboard className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Flow<span className="text-blue-600">Board</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Button variant="ghost">
              <Link href="/login">Zaloguj się</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">Zarejestruj się</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative flex justify-center">
        <div className="pointer-events-none absolute -left-40 top-10 size-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-7xl px-6 py-20 gird w-full">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
              <Zap className="size-4 text-blue-600" />
              <span>Pracuj mądrzej, nie ciężej</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Wszystkie Twoje projekty.
              <span className="mt-2 block text-blue-600">Jedna tablica.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Zarządzaj zadaniami, organizuj projekty i współpracuj z zespołem w
              jednym miejscu. Z FlowBoard zamienisz chaos w uporządkowany plan
              działania.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 bg-blue-600 px-6 text-base hover:bg-blue-700"
              >
                <Link href="/register">Zacznij za darmo</Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base"
              >
                <Link href="/login">Mam już konto</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Prosta organizacja
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Przejrzysty interfejs
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Funkcjonalności
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Wszystko, czego potrzebujesz do sprawnej pracy
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Narzędzia, które pomagają Ci planować, organizować i realizować
              projekty bez zbędnego chaosu.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="group border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <CardHeader>
                    <div
                      className={`mb-3 flex size-12 items-center justify-center rounded-xl ${feature.color}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7 font-bold uppercase text-red-600">
                      {feature.warning}
                    </p>
                    <p className="leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Dlaczego FlowBoard?
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Mniej chaosu.
              <span className="block text-blue-600">
                Więcej zrobionych zadań.
              </span>
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              Nie trać czasu na szukanie informacji i zastanawianie się, co
              zrobić dalej. Zorganizuj swoją pracę w jednym miejscu i skup się
              na tym, co naprawdę ważne.
            </p>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl sm:p-12">
            <div className="absolute right-8 top-8 rounded-2xl bg-white/10 p-4">
              <Zap className="size-8" />
            </div>

            <p className="text-sm font-medium text-blue-100">
              Twój projekt. Twoje zasady.
            </p>
            <h3 className="mt-12 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
              Zamień pomysły w konkretne działania.
            </h3>
            <p className="mt-5 max-w-sm leading-7 text-blue-100">
              Twórz tablice, planuj zadania i współpracuj z zespołem w
              przejrzystym środowisku pracy.
            </p>

            <Button
              size="lg"
              className="mt-8 bg-white text-blue-700 hover:bg-blue-50"
            >
              <Link href="/register">Utwórz konto</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <LayoutDashboard className="size-4" />
            </div>
            <span className="font-bold">
              Flow<span className="text-blue-600">Board</span>
            </span>
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FlowBoard. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </main>
  );
}
