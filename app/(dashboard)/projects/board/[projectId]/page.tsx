import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard, getBoardMembers } from "@/lib/data/board";
import Forbidden from "@/components/Forbbiden";
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
    return <Forbidden />;
  }

  const id = Number(projectId);

  if (Number.isNaN(id)) {
    return <>Nieprawidłowe ID Boarda</>;
  }

  const board = await getBoard(id);

  if (!board) {
    return <Forbidden />;
  }

  const boardId = board.id;

  const [members] = await Promise.all([getBoardMembers(boardId)]);

  return <Board user={user} board={board} members={members} />;
}
