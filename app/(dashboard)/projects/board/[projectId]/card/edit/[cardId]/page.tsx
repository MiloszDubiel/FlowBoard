import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getBoard, getBoardMembers, getCard } from "@/lib/data/board";
import Forbidden from "@/components/Forbbiden";
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

  const card = await getCard(Number(cardId), Number(board.id));

  if (!card) {
    return <Forbidden />;
  }

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

  const labels = await prisma.label.findMany({
    where: {
      boardId: board.id,
    },
  });

  return <EditCard card={card} cardMemebrs={onlyMemebrs} labels={labels} />;
}
