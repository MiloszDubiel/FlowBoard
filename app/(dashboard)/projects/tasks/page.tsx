import Tasks from "@/components/Tasks";
import { getMyCards } from "@/lib/data/board";

export default async function TaskPage() {
  const cards = await getMyCards();

  return (
    <section className="min-h-screen w-full flex-1 bg-muted/30">
      <Tasks cards={cards} />
    </section>
  );
}
