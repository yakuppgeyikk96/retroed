import type { Socket, Server as SocketIOServer } from "socket.io";

export interface SocketData {
  socket: Socket;
  io: SocketIOServer;
}

export interface JoinRoomData {
  roomId: string;
}

export interface LeaveRoomData {
  roomId: string;
}

export interface CloseRoomData {
  roomId: string;
}

export interface AddCardData {
  roomId: string;
  column: string;
  content: string;
}

export interface UpdateCardData {
  roomId: string;
  cardId: string;
  content: string;
}

export interface DeleteCardData {
  roomId: string;
  cardId: string;
}

export type SocketEventHandler<T = unknown> = (
  data: T,
  socketData: SocketData
) => void | Promise<void>;
