"use client";

import { SERVER_EVENTS } from "@/lib/events";
import { getSocket } from "@/lib/socket";
import type { RetroCard } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

interface RetrospectiveBoardProps {
  roomId: string;
}

export default function RetrospectiveBoard({
  roomId,
}: RetrospectiveBoardProps) {
  const [cards, setCards] = useState<RetroCard[]>([]);
  const socketRef = useRef<Socket | null>(null);

  console.log(roomId);

  useEffect(() => {
    const socketInstance = getSocket();
    socketRef.current = socketInstance;

    const handleCardAdded = (card: RetroCard) => {
      setCards((prev) => [...prev, card]);
    };

    const handleCardUpdated = (data: {
      cardId: string;
      content: string;
      updatedAt: string;
    }) => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === data.cardId
            ? { ...card, content: data.content, updatedAt: data.updatedAt }
            : card
        )
      );
    };

    const handleCardDeleted = (data: { cardId: string }) => {
      setCards((prev) => prev.filter((card) => card.id !== data.cardId));
    };

    socketInstance.on(SERVER_EVENTS.CARD_ADDED, handleCardAdded);
    socketInstance.on(SERVER_EVENTS.CARD_UPDATED, handleCardUpdated);
    socketInstance.on(SERVER_EVENTS.CARD_DELETED, handleCardDeleted);

    return () => {
      socketInstance.off(SERVER_EVENTS.CARD_ADDED, handleCardAdded);
      socketInstance.off(SERVER_EVENTS.CARD_UPDATED, handleCardUpdated);
      socketInstance.off(SERVER_EVENTS.CARD_DELETED, handleCardDeleted);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
      <p className="text-zinc-600 dark:text-zinc-400">
        Retrospective board will be here...
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
        Cards: {cards.length}
      </p>
    </div>
  );
}
