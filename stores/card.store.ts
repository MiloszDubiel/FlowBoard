import { create } from "zustand";
import { move } from "@dnd-kit/helpers";

type Card = {
  id: number;
  title: string;
  position: number;
  listId: number;
};

type CardStore = {
  lists: Record<number, Card[]>;

  setLists: (lists: Record<number, Card[]>) => void;
  moveCards: (event: any) => void;
};

export const useCardStore = create<CardStore>((set) => ({
  lists: {},

  setLists: (lists) => set({ lists }),

  moveCards: (event) =>
    set((state) => ({
      lists: move(state.lists, event),
    })),
}));
