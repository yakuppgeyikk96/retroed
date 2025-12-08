import { SERVER_EVENTS } from "../../src/lib/events";
import * as roomStore from "../store/roomStore";
import type {
  JoinRoomData,
  LeaveRoomData,
  SocketEventHandler,
} from "../types/events";

export const handleJoinRoom: SocketEventHandler<JoinRoomData> = (
  data,
  { socket }
) => {
  socket.join(data.roomId);
  console.log(`Socket ${socket.id} joined room: ${data.roomId}`);

  const isOwner = !roomStore.getRoomOwner(data.roomId);
  if (isOwner) {
    roomStore.setRoomOwner(data.roomId, socket.id);
  }

  const ownerId = roomStore.getRoomOwner(data.roomId)!;

  socket.emit(SERVER_EVENTS.ROOM_JOINED, {
    roomId: data.roomId,
    isOwner: socket.id === ownerId,
    ownerId: ownerId,
  });

  socket.to(data.roomId).emit(SERVER_EVENTS.USER_JOINED, {
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });
};

export const handleLeaveRoom: SocketEventHandler<LeaveRoomData> = (
  data,
  { socket }
) => {
  const wasOwner = roomStore.isRoomOwner(data.roomId, socket.id);

  socket.leave(data.roomId);
  console.log(`Socket ${socket.id} left room: ${data.roomId}`);

  if (wasOwner) {
    roomStore.removeRoomOwner(data.roomId);
  }

  socket.to(data.roomId).emit(SERVER_EVENTS.USER_LEFT, {
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });
};
