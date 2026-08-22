import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard } from "@/lib/data/board";

import Board from "@/components/board/Board";
export default async function BoardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  const board = (await getBoard(Number(id), Number(user?.userID))) ?? [];

  return (
    <>
      <Board user={user} board={board} />
    </>
  );
}
