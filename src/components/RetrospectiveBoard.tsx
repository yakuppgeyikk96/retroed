"use client";

import { useRoomStore } from "@/store/useRoomStore";

interface RetrospectiveBoardProps {
  roomId: string;
}

export default function RetrospectiveBoard({
  roomId,
}: RetrospectiveBoardProps) {
  const { cards } = useRoomStore();

  console.log(roomId);

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
