import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard } from "@/lib/data/board";
import { getBoardMembers } from "@/lib/data/board";
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
  const board = (await getBoard(Number(projectId), Number(user?.userID))) ?? [];

  const members = await getBoardMembers(Number(projectId));

  return <>{<Board user={user} board={board} members={members} />}</>;
}
