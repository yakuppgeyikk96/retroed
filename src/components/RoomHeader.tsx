"use client";

import { CLIENT_EVENTS } from "@/lib/events";
import { getSocket } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";
import { Share2, X } from "lucide-react";
import { useState } from "react";

interface RoomHeaderProps {
  roomId: string;
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  const [isShareCopied, setIsShareCopied] = useState(false);
  const { isConnected, isOwner } = useRoomStore();

  const handleShare = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClose = () => {
    const socket = getSocket();
    socket.emit(CLIENT_EVENTS.CLOSE_ROOM, { roomId });
  };

  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Retrospective - {roomId}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          {isConnected ? "✅ Connected" : "⏳ Connecting..."}
        </p>
      </div>

      {isOwner && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 size={18} />
            <span className="text-sm font-medium">
              {isShareCopied ? "Copied!" : "Share"}
            </span>
          </button>

          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <X size={18} />
            <span className="text-sm font-medium">Close</span>
          </button>
        </div>
      )}
    </div>
  );
}
