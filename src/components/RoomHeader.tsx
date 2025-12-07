"use client";

import { CLIENT_EVENTS, SOCKET_EVENTS } from "@/lib/events";
import { getSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

interface RoomHeaderProps {
  roomId: string;
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInstance = getSocket();
    socketRef.current = socketInstance;

    const handleConnect = () => {
      setIsConnected(true);
      socketInstance.emit(CLIENT_EVENTS.JOIN_ROOM, { roomId });
    };

    socketInstance.on(SOCKET_EVENTS.CONNECT, handleConnect);

    if (socketInstance.connected) {
      queueMicrotask(() => {
        handleConnect();
      });
    }

    return () => {
      socketInstance.off(SOCKET_EVENTS.CONNECT, handleConnect);
    };
  }, [roomId]);

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Retrospective - {roomId}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mt-2">
        {isConnected ? "✅ Connected" : "⏳ Connecting..."}
      </p>
    </div>
  );
}
