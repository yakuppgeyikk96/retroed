import type { RetroCard } from "@/lib/types";
import { create } from "zustand";

interface RoomState {
  roomId: string | null;
  isConnected: boolean;
  isOwner: boolean;
  cards: RetroCard[];
  socketId: string | null;

  // Actions
  setRoomId: (roomId: string) => void;
  setConnected: (connected: boolean) => void;
  setOwner: (isOwner: boolean) => void;
  setSocketId: (socketId: string | null) => void;
  addCard: (card: RetroCard) => void;
  updateCard: (cardId: string, content: string) => void;
  deleteCard: (cardId: string) => void;
  reset: () => void;
}

const initialState = {
  roomId: null,
  isConnected: false,
  isOwner: false,
  cards: [],
  socketId: null,
};

export const useRoomStore = create<RoomState>((set) => ({
  ...initialState,

  setRoomId: (roomId) => set({ roomId }),
  setConnected: (connected) => set({ isConnected: connected }),
  setOwner: (isOwner) => set({ isOwner }),
  setSocketId: (socketId) => set({ socketId }),

  addCard: (card) =>
    set((state) => ({
      cards: [...state.cards, card],
    })),

  updateCard: (cardId, content) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? { ...card, content, updatedAt: new Date().toISOString() }
          : card
      ),
    })),

  deleteCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    })),

  reset: () => set(initialState),
}));
