import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard, getBoardMembers, getCard } from "@/lib/data/board";
import CardDetails from "@/components/board/CardDetails";
import AddCard from "@/components/board/AddCard";

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
    return <>Brak dostępu</>;
  }

  const id = Number(projectId);

  if (Number.isNaN(id)) {
    return <>Nieprawidłowe ID Projektu</>;
  }

  const board = await getBoard(id);

  if (!board) {
    return <>Board nie istnieje lub nie masz do niego dostępu</>;
  }

  const members = await getBoardMembers(board.id);

  return (
    <AddCard listId={Number(listId)} members={members} boardId={board.id} />
  );
}
