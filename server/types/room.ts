import { RetroCard } from "@/lib/types";

export interface RoomData {
  owner: string;
  cards: RetroCard[];
  attendees: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface RoomDataRedis {
  owner: string;
  cards: string;
  attendees: string;
  createdAt: string;
  updatedAt?: string;
}
