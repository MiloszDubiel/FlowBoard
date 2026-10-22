import { create } from "zustand";

type LockStore = {
  lock: boolean;
  setLock: (lock: boolean) => void;
};

export const useLockStore = create<LockStore>((set) => ({
  lock: false,

  setLock: (lock) =>
    set({
      lock,
    }),
}));
