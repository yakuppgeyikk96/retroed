import type { Socket, Server as SocketIOServer } from "socket.io";
import { CLIENT_EVENTS, SOCKET_EVENTS } from "../../src/lib/events";
import type { SocketData } from "../types/events";
import * as cardHandlers from "./cardHandlers";
import * as roomHandlers from "./roomHandlers";

export interface EventHandlerMap {
  [eventName: string]: (data: unknown, socketData: SocketData) => void;
}

export const registerHandlers = (socket: Socket, io: SocketIOServer): void => {
  const socketData: SocketData = { socket, io };

  // Room handlers
  socket.on(CLIENT_EVENTS.JOIN_ROOM, (data) =>
    roomHandlers.handleJoinRoom(data, socketData)
  );
  socket.on(CLIENT_EVENTS.LEAVE_ROOM, (data) =>
    roomHandlers.handleLeaveRoom(data, socketData)
  );
  socket.on(CLIENT_EVENTS.CLOSE_ROOM, (data) =>
    roomHandlers.handleCloseRoom(data, socketData)
  );

  // Card handlers
  socket.on(CLIENT_EVENTS.ADD_CARD, (data) =>
    cardHandlers.handleAddCard(data, socketData)
  );
  socket.on(CLIENT_EVENTS.UPDATE_CARD, (data) =>
    cardHandlers.handleUpdateCard(data, socketData)
  );
  socket.on(CLIENT_EVENTS.DELETE_CARD, (data) =>
    cardHandlers.handleDeleteCard(data, socketData)
  );

  // Connection handlers
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};
