import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getBoard,
  getBoardCards,
  getBoardLists,
  getBoardMembers,
} from "@/lib/data/board";
import Board from "@/components/board/Board";
import { getProject, getProjects } from "@/lib/data/projects";
import { getCard } from "@/lib/data/cards";
import { CardDetails } from "@/components/board/CardDetails";

export default async function CardPage({
  params,
}: {
  params: Promise<{
    cardId: string;
    projectId: string;
  }>;
}) {
  const { projectId, cardId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return <>Brak dostępu</>;
  }

  const id = Number(cardId);

  if (Number.isNaN(id)) {
    return <>Nieprawidłowe ID Card</>;
  }

  const projects = await getProjects();

  if (!projects) {
    return <>Projekt nie istnieje lub nie masz do niego dostępu</>;
  }

  try {
    const card = await getCard(Number(projectId), Number(cardId));
    return <CardDetails card={card} />;
  } catch (err) {
    return <>BŁAD</>;
  }
}
