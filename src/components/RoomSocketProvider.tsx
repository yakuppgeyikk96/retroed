"use client";

import { useRoomSocket } from "@/hooks/useRoomSocket";
import { useRoomStore } from "@/store/useRoomStore";
import { useEffect } from "react";

interface RoomSocketProviderProps {
  roomId: string;
  children: React.ReactNode;
}

export function RoomSocketProvider({
  roomId,
  children,
}: RoomSocketProviderProps) {
  useRoomSocket(roomId);
  const { reset } = useRoomStore();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [roomId, reset]);

  return <>{children}</>;
}
