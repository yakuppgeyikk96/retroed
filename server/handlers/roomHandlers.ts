import { SERVER_EVENTS } from "../../src/lib/events";
import { createRoom, deleteRoom, roomExists } from "../lib/roomRepository";
import * as roomStore from "../store/roomStore";
import type {
  CloseRoomData,
  JoinRoomData,
  LeaveRoomData,
  SocketEventHandler,
} from "../types/events";

export const handleJoinRoom: SocketEventHandler<JoinRoomData> = async (
  data,
  { socket }
) => {
  socket.join(data.roomId);
  console.log(`Socket ${socket.id} joined room: ${data.roomId}`);

  const isOwner = !roomStore.getRoomOwner(data.roomId);

  if (isOwner) {
    roomStore.setRoomOwner(data.roomId, socket.id);

    try {
      const isRoomExists = await roomExists(data.roomId);

      if (!isRoomExists) {
        await createRoom(data.roomId, socket.id);
      }
    } catch (error) {
      console.error(`Error creating room ${data.roomId}:`, error);
    }
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

export const handleCloseRoom: SocketEventHandler<CloseRoomData> = async (
  data,
  { socket, io }
) => {
  if (!roomStore.isRoomOwner(data.roomId, socket.id)) {
    console.log(
      `Socket ${socket.id} tried to close room ${data.roomId} but is not owner`
    );
    return;
  }

  io.to(data.roomId).emit(SERVER_EVENTS.ROOM_CLOSED, {
    roomId: data.roomId,
    timestamp: new Date().toISOString(),
  });

  roomStore.removeRoomOwner(data.roomId);

  try {
    await deleteRoom(data.roomId);
  } catch (error) {
    console.error(`Failed to delete room from Redis: ${error}`);
  }

  console.log(`Room ${data.roomId} closed by owner ${socket.id}`);
};
