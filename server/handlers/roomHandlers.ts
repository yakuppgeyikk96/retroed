import { SERVER_EVENTS } from "../../src/lib/events";
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

  socket.to(data.roomId).emit(SERVER_EVENTS.USER_JOINED, {
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });
};

export const handleLeaveRoom: SocketEventHandler<LeaveRoomData> = (
  data,
  { socket }
) => {
  socket.leave(data.roomId);
  console.log(`Socket ${socket.id} left room: ${data.roomId}`);

  socket.to(data.roomId).emit(SERVER_EVENTS.USER_LEFT, {
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });
};
