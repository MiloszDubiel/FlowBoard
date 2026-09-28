import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard, getBoardMembers, getCard } from "@/lib/data/board";
import AddCard from "@/components/board/AddCard";
import { prisma } from "@/lib/prisma";
import Forbidden from "@/components/Forbbiden";

export default async function AddCardPage({
  params,
}: {
  params: Promise<{
    projectId: string;
    listId: string;
  }>;
}) {
  const { projectId, listId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return <Forbidden />;
  }

  const id = Number(projectId);

  if (Number.isNaN(id)) {
    return <>Nieprawidłowe ID Projektu</>;
  }

  const board = await getBoard(id);

  if (!board) {
    return <Forbidden />;
  }

  const members = await getBoardMembers(board.id);
  const labels = await prisma.label.findMany({
    where: {
      boardId: board.id,
    },
  });

  return (
    <AddCard
      listId={Number(listId)}
      members={members}
      boardId={board.id}
      labels={labels}
    />
  );
}
