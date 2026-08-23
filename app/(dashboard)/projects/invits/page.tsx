import Invites from "@/components/project/Invites";

import { getInvits, GetInvitsType } from "@/lib/data/inivts";

export default async function DashboardPage() {
  const invits: any = await getInvits();

  return (
    <section className="min-h-screen w-full flex-1 bg-muted/30">
      <Invites invites={invits} />
    </section>
  );
}
