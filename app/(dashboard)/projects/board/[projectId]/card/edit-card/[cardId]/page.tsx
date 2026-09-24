import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard, getBoardMembers, getCard } from "@/lib/data/board";
import AddCard from "@/components/board/AddCard";
import CardForm from "@/components/CardForm";
import EditCard from "@/components/board/EditCard";
import { prisma } from "@/lib/prisma";

export default async function AddCardPage({
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

  const members = await getBoardMembers(board.id);

  const card = await getCard(Number(cardId), Number(board.id));
  const memebrships = await prisma.cardMember.findMany({
    where: {
      cardId: Number(cardId),
    },
    include: {
      user: true,
    },
  });

  const onlyMemebrs = members.filter((member) => {
    const findUser = memebrships.find((el) => member.role === "MEMBER");

    return findUser;
  });

  return <EditCard card={card} cardMemebrs={onlyMemebrs} />;
}
