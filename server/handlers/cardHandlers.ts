import { SERVER_EVENTS } from "../../src/lib/events";
import type {
  AddCardData,
  DeleteCardData,
  SocketEventHandler,
  UpdateCardData,
} from "../types/events";

export const handleAddCard: SocketEventHandler<AddCardData> = (
  data,
  { io }
) => {
  const cardData = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content: data.content,
    column: data.column,
    createdAt: new Date().toISOString(),
  };

  io.to(data.roomId).emit(SERVER_EVENTS.CARD_ADDED, cardData);
  console.log(`Card added to room ${data.roomId}:`, cardData);
};

export const handleUpdateCard: SocketEventHandler<UpdateCardData> = (
  data,
  { io }
) => {
  io.to(data.roomId).emit(SERVER_EVENTS.CARD_UPDATED, {
    cardId: data.cardId,
    content: data.content,
    updatedAt: new Date().toISOString(),
  });
  console.log(`Card updated in room ${data.roomId}:`, data.cardId);
};

export const handleDeleteCard: SocketEventHandler<DeleteCardData> = (
  data,
  { io }
) => {
  io.to(data.roomId).emit(SERVER_EVENTS.CARD_DELETED, {
    cardId: data.cardId,
    deletedAt: new Date().toISOString(),
  });
  console.log(`Card deleted in room ${data.roomId}:`, data.cardId);
};
