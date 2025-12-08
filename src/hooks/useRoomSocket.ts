import { CLIENT_EVENTS, SERVER_EVENTS, SOCKET_EVENTS } from "@/lib/events";
import { getSocket } from "@/lib/socket";
import type { RetroCard } from "@/lib/types";
import { useRoomStore } from "@/store/useRoomStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRoomSocket(roomId: string) {
  const router = useRouter();
  const {
    setConnected,
    setOwner,
    setSocketId,
    addCard,
    updateCard,
    deleteCard,
    setRoomId,
  } = useRoomStore();

  useEffect(() => {
    const socketInstance = getSocket();
    setRoomId(roomId);

    const handleConnect = () => {
      setConnected(true);
      setSocketId(socketInstance.id || null);
      socketInstance.emit(CLIENT_EVENTS.JOIN_ROOM, { roomId });
    };

    const handleRoomJoined = (data: {
      roomId: string;
      isOwner: boolean;
      ownerId: string;
    }) => {
      setOwner(data.isOwner);
    };

    const handleRoomClosed = () => {
      router.push("/");
    };

    const handleCardAdded = (card: RetroCard) => {
      addCard(card);
    };

    const handleCardUpdated = (data: {
      cardId: string;
      content: string;
      updatedAt: string;
    }) => {
      updateCard(data.cardId, data.content);
    };

    const handleCardDeleted = (data: { cardId: string }) => {
      deleteCard(data.cardId);
    };

    socketInstance.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socketInstance.on(SERVER_EVENTS.ROOM_JOINED, handleRoomJoined);
    socketInstance.on(SERVER_EVENTS.ROOM_CLOSED, handleRoomClosed);
    socketInstance.on(SERVER_EVENTS.CARD_ADDED, handleCardAdded);
    socketInstance.on(SERVER_EVENTS.CARD_UPDATED, handleCardUpdated);
    socketInstance.on(SERVER_EVENTS.CARD_DELETED, handleCardDeleted);

    if (socketInstance.connected) {
      queueMicrotask(() => {
        handleConnect();
      });
    }

    return () => {
      socketInstance.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socketInstance.off(SERVER_EVENTS.ROOM_JOINED, handleRoomJoined);
      socketInstance.off(SERVER_EVENTS.ROOM_CLOSED, handleRoomClosed);
      socketInstance.off(SERVER_EVENTS.CARD_ADDED, handleCardAdded);
      socketInstance.off(SERVER_EVENTS.CARD_UPDATED, handleCardUpdated);
      socketInstance.off(SERVER_EVENTS.CARD_DELETED, handleCardDeleted);
    };
  }, [
    roomId,
    setConnected,
    setOwner,
    setSocketId,
    addCard,
    updateCard,
    deleteCard,
    setRoomId,
    router,
  ]);
}
