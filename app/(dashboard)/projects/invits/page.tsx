import Invites from "@/components/project/Invites";
import { Board } from "@/generated/prisma/client";

import { getInvits} from "@/lib/data/inivts";

export type IniviteType = {
  board: Board;
  id: number;
  createdAt: Date;
  boardId: number;
  userId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
};

export default async function DashboardPage() {
  const invits: IniviteType[] | null = await getInvits();

  return (
    <section className="min-h-screen w-full flex-1 bg-muted/30">
      <Invites invites={invits} />
    </section>
  );
}
