export type RetroColumn = "good" | "bad" | "actions";

export interface RetroCard {
  id: string;
  content: string;
  author: string;
  column: RetroColumn;
  createdAt: string;
  updatedAt?: string;
}

export interface RoomState {
  roomId: string;
  cards: RetroCard[];
  users: string[];
}
