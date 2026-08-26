import { create } from "zustand";

import type { Card as CardType, List } from "@/generated/prisma/client";

type CardStore = {
  cards: CardType[];

  setCards: (cards: CardType[]) => void;
  addCard: (card: CardType) => void;
  removeCard: (cardId: number) => void;
  updateCard: (cardId: number, data: Partial<CardType>) => void;
};

export const useCardStore = create<CardStore>((set) => ({
  cards: [],

  setCards: (cards) =>
    set({
      cards,
    }),

  addCard: (card) =>
    set((state) => ({
      cards: [...state.cards, card],
    })),

  removeCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    })),

  updateCard: (cardId, data) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, ...data } : card,
      ),
    })),
}));
