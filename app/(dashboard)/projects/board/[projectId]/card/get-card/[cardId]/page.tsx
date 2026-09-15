import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard, getCard } from "@/lib/data/board";
import CardDetails from "@/components/board/CardDetails";

export default async function CardPage({
  params,
}: {
  params: Promise<{
    projectId: string;
    cardId: string;
  }>;
}) {
  const { projectId, cardId } = await params;

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

  const boardId = board.id;

  const card = await getCard(Number(cardId), boardId);

  return (
    <CardDetails
      card={card}
      boardId={boardId}
      role={board.members.find((el) => el.userId === Number(user.userID))?.role}
    />
  );
}
