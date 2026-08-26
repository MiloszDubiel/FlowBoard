import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getBoard,
  getBoardCards,
  getBoardLists,
  getBoardMembers,
} from "@/lib/data/board";
import Board from "@/components/board/Board";

export default async function BoardPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return <>Brak dostępu</>;
  }

  const id = Number(projectId);

  if (Number.isNaN(id)) {
    return <>Nieprawidłowe ID Boarda</>;
  }

  const board = await getBoard(id);

  if (!board) {
    return <>Board nie istnieje lub nie masz do niego dostępu</>;
  }

  const boardId = board.id;

  const [members] = await Promise.all([getBoardMembers(boardId)]);

  return <Board user={user} board={board} members={members} />;
}
