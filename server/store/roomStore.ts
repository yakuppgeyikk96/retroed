const roomOwners = new Map<string, string>();

export const getRoomOwner = (roomId: string): string | undefined => {
  return roomOwners.get(roomId);
};

export const setRoomOwner = (roomId: string, socketId: string): void => {
  if (!roomOwners.has(roomId)) {
    roomOwners.set(roomId, socketId);
  }
};

export const removeRoomOwner = (roomId: string): void => {
  roomOwners.delete(roomId);
};

export const isRoomOwner = (roomId: string, socketId: string): boolean => {
  return roomOwners.get(roomId) === socketId;
};
