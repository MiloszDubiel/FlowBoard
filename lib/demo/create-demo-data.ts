import { Prisma } from "@/generated/prisma/client";

export async function createDemoData(
  tx: Prisma.TransactionClient,
  userId: number,
) {
  const now = new Date();

  const daysFromNow = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date;
  };

  // PROJEKT 1 - FLOWBOARD

  const flowProject = await tx.project.create({
    data: {
      name: "FlowBoard",
      description: "Rozwój aplikacji do zarządzania projektami i zadaniami.",
      ownerId: userId,
      color: "BLUE",
    },
  });

  const flowBoard = await tx.board.create({
    data: {
      name: "Rozwój produktu",
      description: "Planowanie i realizacja funkcjonalności FlowBoard.",
      ownerId: userId,
      projectId: flowProject.id,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  const flowLabels = await Promise.all([
    tx.label.create({
      data: {
        boardId: flowBoard.id,
        name: "Frontend",
        color: "#3B82F6",
      },
    }),
    tx.label.create({
      data: {
        boardId: flowBoard.id,
        name: "Backend",
        color: "#8B5CF6",
      },
    }),
    tx.label.create({
      data: {
        boardId: flowBoard.id,
        name: "Bug",
        color: "#EF4444",
      },
    }),
    tx.label.create({
      data: {
        boardId: flowBoard.id,
        name: "Design",
        color: "#EC4899",
      },
    }),
    tx.label.create({
      data: {
        boardId: flowBoard.id,
        name: "Pilne",
        color: "#F97316",
      },
    }),
  ]);

  const flowLists = await Promise.all([
    tx.list.create({
      data: {
        boardId: flowBoard.id,
        name: "Do zrobienia",
        position: 0,
      },
    }),
    tx.list.create({
      data: {
        boardId: flowBoard.id,
        name: "W trakcie",
        position: 1,
      },
    }),
    tx.list.create({
      data: {
        boardId: flowBoard.id,
        name: "Do sprawdzenia",
        position: 2,
      },
    }),
    tx.list.create({
      data: {
        boardId: flowBoard.id,
        name: "Ukończone",
        position: 3,
      },
    }),
  ]);

  const [todo, inProgress, review, done] = flowLists;

  const card1 = await tx.card.create({
    data: {
      listId: todo.id,
      title: "Przygotowanie systemu powiadomień",
      description:
        "Opracowanie systemu powiadomień informujących użytkowników o zmianach na tablicach i przypisanych zadaniach.",
      position: 0,
      priority: "HIGH",
      dueDate: daysFromNow(4),
      createdById: userId,
      tasks: [
        {
          id: "c1_t1",
          name: "Przygotować model Notification",
          isCompleted: true,
        },
        { id: "c1_t2", name: "Dodać obsługę powiadomień", isCompleted: false },
        {
          id: "c1_t3",
          name: "Przygotować widok powiadomień",
          isCompleted: false,
        },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card2 = await tx.card.create({
    data: {
      listId: todo.id,
      title: "Poprawa responsywności tablic",
      description:
        "Dostosowanie widoku tablic i kart do urządzeń mobilnych oraz tabletów.",
      position: 1,
      priority: "MEDIUM",
      dueDate: daysFromNow(8),
      createdById: userId,
      tasks: [
        { id: "c2_t1", name: "Widok mobilny", isCompleted: false },
        { id: "c2_t2", name: "Widok tabletowy", isCompleted: false },
        {
          id: "c2_t3",
          name: "Testowanie różnych rozdzielczości",
          isCompleted: false,
        },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card3 = await tx.card.create({
    data: {
      listId: inProgress.id,
      title: "Implementacja przeciągania kart",
      description:
        "Dodanie możliwości zmiany kolejności kart oraz przenoszenia ich pomiędzy listami.",
      position: 0,
      priority: "URGENT",
      dueDate: daysFromNow(2),
      createdById: userId,
      tasks: [
        { id: "c3_t1", name: "Instalacja biblioteki DnD", isCompleted: true },
        { id: "c3_t2", name: "Obsługa przeciągania", isCompleted: true },
        { id: "c3_t3", name: "Zapisywanie nowej pozycji", isCompleted: false },
        { id: "c3_t4", name: "Obsługa błędów", isCompleted: false },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card4 = await tx.card.create({
    data: {
      listId: review.id,
      title: "Walidacja formularzy",
      description:
        "Sprawdzenie poprawności walidacji formularzy logowania i rejestracji.",
      position: 0,
      priority: "MEDIUM",
      dueDate: daysFromNow(1),
      createdById: userId,
      tasks: [
        { id: "c4_t1", name: "Walidacja adresu email", isCompleted: true },
        { id: "c4_t2", name: "Walidacja hasła", isCompleted: true },
        { id: "c4_t3", name: "Komunikaty błędów", isCompleted: false },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card5 = await tx.card.create({
    data: {
      listId: done.id,
      title: "Konfiguracja bazy danych",
      description: "Przygotowanie schematu Prisma i konfiguracja PostgreSQL.",
      position: 0,
      priority: "HIGH",
      dueDate: daysFromNow(-5),
      createdById: userId,
      tasks: [
        { id: "c5_t1", name: "Konfiguracja PostgreSQL", isCompleted: true },
        { id: "c5_t2", name: "Przygotowanie modeli", isCompleted: true },
        { id: "c5_t3", name: "Migracja bazy danych", isCompleted: true },
      ],
      members: {
        create: { userId },
      },
    },
  });

  // PROJEKT 2 - PORTFOLIO

  const portfolioProject = await tx.project.create({
    data: {
      name: "Portfolio",
      description: "Budowa profesjonalnego portfolio programisty.",
      ownerId: userId,
      color: "PURPLE",
    },
  });

  const portfolioBoard = await tx.board.create({
    data: {
      name: "Strona portfolio",
      description: "Planowanie i realizacja strony portfolio.",
      ownerId: userId,
      projectId: portfolioProject.id,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  const portfolioLabels = await Promise.all([
    tx.label.create({
      data: {
        boardId: portfolioBoard.id,
        name: "UI/UX",
        color: "#EC4899",
      },
    }),
    tx.label.create({
      data: {
        boardId: portfolioBoard.id,
        name: "Development",
        color: "#3B82F6",
      },
    }),
    tx.label.create({
      data: {
        boardId: portfolioBoard.id,
        name: "Content",
        color: "#EAB308",
      },
    }),
  ]);

  const portfolioLists = await Promise.all([
    tx.list.create({
      data: {
        boardId: portfolioBoard.id,
        name: "Pomysły",
        position: 0,
      },
    }),
    tx.list.create({
      data: {
        boardId: portfolioBoard.id,
        name: "Realizacja",
        position: 1,
      },
    }),
    tx.list.create({
      data: {
        boardId: portfolioBoard.id,
        name: "Gotowe",
        position: 2,
      },
    }),
  ]);

  const [ideas, portfolioProgress, portfolioDone] = portfolioLists;

  const card6 = await tx.card.create({
    data: {
      listId: ideas.id,
      title: "Przygotowanie projektu strony",
      description: "Opracowanie koncepcji wizualnej i struktury portfolio.",
      position: 0,
      priority: "HIGH",
      dueDate: daysFromNow(6),
      createdById: userId,
      tasks: [
        { id: "c6_t1", name: "Inspiracje i referencje", isCompleted: true },
        { id: "c6_t2", name: "Makieta strony", isCompleted: false },
        { id: "c6_t3", name: "Dobór kolorystyki", isCompleted: false },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card7 = await tx.card.create({
    data: {
      listId: ideas.id,
      title: "Przygotowanie opisów projektów",
      description: "Stworzenie opisów technologii i funkcjonalności projektów.",
      position: 1,
      priority: "MEDIUM",
      dueDate: daysFromNow(9),
      createdById: userId,
      tasks: [
        { id: "c7_t1", name: "Opis FlowBoard", isCompleted: false },
        { id: "c7_t2", name: "Opis pozostałych projektów", isCompleted: false },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card8 = await tx.card.create({
    data: {
      listId: portfolioProgress.id,
      title: "Budowa sekcji projektów",
      description: "Implementacja kart prezentujących wykonane projekty.",
      position: 0,
      priority: "HIGH",
      dueDate: daysFromNow(3),
      createdById: userId,
      tasks: [
        { id: "c8_t1", name: "Komponent ProjectCard", isCompleted: true },
        { id: "c8_t2", name: "Responsywny grid", isCompleted: false },
        { id: "c8_t3", name: "Linki do GitHuba", isCompleted: false },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card9 = await tx.card.create({
    data: {
      listId: portfolioDone.id,
      title: "Konfiguracja Next.js",
      description: "Utworzenie projektu i podstawowa konfiguracja środowiska.",
      position: 0,
      priority: "MEDIUM",
      createdById: userId,
      dueDate: daysFromNow(-3),
      members: {
        create: { userId },
      },
    },
  });

  // PROJEKT 3 - MARKETING

  const marketingProject = await tx.project.create({
    data: {
      name: "Marketing",
      description: "Planowanie treści i działań promujących produkt.",
      ownerId: userId,
      color: "GREEN",
    },
  });

  const marketingBoard = await tx.board.create({
    data: {
      name: "Plan marketingowy",
      description: "Organizacja działań marketingowych i publikacji.",
      ownerId: userId,
      projectId: marketingProject.id,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  const marketingLabels = await Promise.all([
    tx.label.create({
      data: {
        boardId: marketingBoard.id,
        name: "Social Media",
        color: "#06B6D4",
      },
    }),
    tx.label.create({
      data: {
        boardId: marketingBoard.id,
        name: "Publikacja",
        color: "#22C55E",
      },
    }),
    tx.label.create({
      data: {
        boardId: marketingBoard.id,
        name: "Planowanie",
        color: "#F97316",
      },
    }),
  ]);

  const marketingLists = await Promise.all([
    tx.list.create({
      data: {
        boardId: marketingBoard.id,
        name: "Do zaplanowania",
        position: 0,
      },
    }),
    tx.list.create({
      data: {
        boardId: marketingBoard.id,
        name: "W trakcie",
        position: 1,
      },
    }),
    tx.list.create({
      data: {
        boardId: marketingBoard.id,
        name: "Opublikowane",
        position: 2,
      },
    }),
  ]);

  const [marketingTodo, marketingProgress, published] = marketingLists;

  const card10 = await tx.card.create({
    data: {
      listId: marketingTodo.id,
      title: "Przygotowanie harmonogramu publikacji",
      description: "Opracowanie miesięcznego kalendarza publikacji.",
      position: 0,
      priority: "MEDIUM",
      dueDate: daysFromNow(5),
      createdById: userId,
      tasks: [
        { id: "c10_t1", name: "Wybór tematów", isCompleted: true },
        {
          id: "c10_t2",
          name: "Przygotowanie harmonogramu",
          isCompleted: false,
        },
        { id: "c10_t3", name: "Ustalenie terminów", isCompleted: false },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card11 = await tx.card.create({
    data: {
      listId: marketingProgress.id,
      title: "Przygotowanie materiałów promocyjnych",
      description: "Stworzenie grafik i treści promujących aplikację.",
      position: 0,
      priority: "HIGH",
      dueDate: daysFromNow(2),
      createdById: userId,
      tasks: [
        { id: "c11_t1", name: "Przygotowanie grafik", isCompleted: true },
        { id: "c11_t2", name: "Przygotowanie tekstów", isCompleted: false },
        { id: "c11_t3", name: "Weryfikacja materiałów", isCompleted: false },
      ],
      members: {
        create: { userId },
      },
    },
  });

  const card12 = await tx.card.create({
    data: {
      listId: published.id,
      title: "Utworzenie profilu produktu",
      description: "Przygotowanie podstawowych informacji o produkcie.",
      position: 0,
      priority: "LOW",
      dueDate: daysFromNow(-2),
      createdById: userId,
      members: {
        create: { userId },
      },
    },
  });

  // PRZYPISANIE ETYKIET DO KART
  await tx.cardLabel.createMany({
    data: [
      { cardId: card1.id, labelId: flowLabels[1].id }, // Backend
      { cardId: card1.id, labelId: flowLabels[4].id }, // Pilne
      { cardId: card2.id, labelId: flowLabels[0].id }, // Frontend
      { cardId: card2.id, labelId: flowLabels[3].id }, // Design
      { cardId: card3.id, labelId: flowLabels[0].id }, // Frontend
      { cardId: card3.id, labelId: flowLabels[1].id }, // Backend
      { cardId: card4.id, labelId: flowLabels[2].id }, // Bug
      { cardId: card5.id, labelId: flowLabels[1].id }, // Backend
      { cardId: card6.id, labelId: portfolioLabels[0].id }, // UI/UX
      { cardId: card7.id, labelId: portfolioLabels[2].id }, // Content
      { cardId: card8.id, labelId: portfolioLabels[1].id }, // Development
      { cardId: card9.id, labelId: portfolioLabels[1].id }, // Development
      { cardId: card10.id, labelId: marketingLabels[2].id }, // Planowanie
      { cardId: card11.id, labelId: marketingLabels[0].id }, // Social Media
      { cardId: card12.id, labelId: marketingLabels[1].id }, // Publikacja
    ],
  });

  // KOMENTARZE

  await tx.comment.createMany({
    data: [
      {
        cardId: card1.id,
        userId,
        content:
          "Warto zadbać o to, żeby użytkownik mógł oznaczać powiadomienia jako przeczytane.",
      },
      {
        cardId: card1.id,
        userId,
        content: "Przyda się również licznik nieprzeczytanych powiadomień.",
      },
      {
        cardId: card3.id,
        userId,
        content:
          "Przeciąganie działa już poprawnie. Pozostało zapisanie nowej kolejności w bazie.",
      },
      {
        cardId: card4.id,
        userId,
        content:
          "Większość przypadków jest już obsłużona. Do sprawdzenia zostały komunikaty błędów.",
      },
      {
        cardId: card8.id,
        userId,
        content:
          "Pamiętaj o poprawnym wyświetlaniu kart na mniejszych ekranach.",
      },
      {
        cardId: card11.id,
        userId,
        content:
          "Materiały graficzne są gotowe. Pozostało przygotowanie treści.",
      },
    ],
  });

  // AKTYWNOŚCI

  await tx.activity.createMany({
    data: [
      {
        boardId: flowBoard.id,
        cardId: card1.id,
        userId,
        type: "CARD_CREATED",
        metadata: {
          title: "Przygotowanie systemu powiadomień",
        },
      },
      {
        boardId: flowBoard.id,
        cardId: card3.id,
        userId,
        type: "CARD_UPDATED",
        metadata: {
          title: "Implementacja przeciągania kart",
        },
      },
      {
        boardId: flowBoard.id,
        cardId: card5.id,
        userId,
        type: "CARD_COMPLETED",
        metadata: {
          title: "Konfiguracja bazy danych",
        },
      },
      {
        boardId: portfolioBoard.id,
        cardId: card8.id,
        userId,
        type: "CARD_CREATED",
        metadata: {
          title: "Budowa sekcji projektów",
        },
      },
      {
        boardId: marketingBoard.id,
        cardId: card11.id,
        userId,
        type: "CARD_UPDATED",
        metadata: {
          title: "Przygotowanie materiałów promocyjnych",
        },
      },
    ],
  });

  // POWIADOMIENIA

  await tx.notification.createMany({
    data: [
      {
        userId,
        type: "CARD_ASSIGNED",
        message: 'Przypisano Ci zadanie "Implementacja przeciągania kart".',
        link: `/board/${flowBoard.id}`,
      },
      {
        userId,
        type: "CARD_COMMENT",
        message:
          'Dodano komentarz do zadania "Przygotowanie systemu powiadomień".',
        link: `/board/${flowBoard.id}`,
      },
      {
        userId,
        type: "CARD_UPDATED",
        message: 'Zaktualizowano zadanie "Budowa sekcji projektów".',
        link: `/board/${portfolioBoard.id}`,
      },
    ],
  });

  return {
    projects: [flowProject, portfolioProject, marketingProject],
    boards: [flowBoard, portfolioBoard, marketingBoard],
    cards: [
      card1,
      card2,
      card3,
      card4,
      card5,
      card6,
      card7,
      card8,
      card9,
      card10,
      card11,
      card12,
    ],
  };
}
