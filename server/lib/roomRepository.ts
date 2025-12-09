import { RoomData, RoomDataRedis } from "../types/room";
import { getRedisClient } from "./redis";

const getRoomKey = (roomId: string): string => `room:${roomId}`;

/**
 * Initializes a new room in Redis.
 */
export const createRoom = async (
  roomId: string,
  ownerSocketId: string
): Promise<void> => {
  const redisClient = getRedisClient();
  const roomKey = getRoomKey(roomId);
  const now = new Date().toISOString();

  const roomData: RoomDataRedis = {
    owner: ownerSocketId,
    cards: JSON.stringify([]),
    attendees: JSON.stringify([]),
    createdAt: now,
  };

  await redisClient.hset(roomKey, roomData);

  console.log(`Room ${roomId} created by ${ownerSocketId}`);
};

/**
 * Get room data
 */
export const getRoomData = async (roomId: string): Promise<RoomData | null> => {
  const redisClient = getRedisClient();
  const roomKey = getRoomKey(roomId);

  const roomDataRedis = await redisClient.hgetall(roomKey);

  if (!roomDataRedis || Object.keys(roomDataRedis).length === 0) {
    return null;
  }

  const roomData: RoomData = {
    owner: roomDataRedis.owner,
    cards: JSON.parse(roomDataRedis.cards || "[]"),
    attendees: JSON.parse(roomDataRedis.attendees || "[]"),
    createdAt: roomDataRedis.createdAt,
    updatedAt: roomDataRedis.updatedAt,
  };

  return roomData;
};

/**
 * Check if room exists in Redis
 */
export const roomExists = async (roomId: string): Promise<boolean> => {
  const redis = getRedisClient();
  const roomKey = getRoomKey(roomId);
  const exists = await redis.exists(roomKey);
  return exists === 1;
};

/**
 * Delete room from Redis
 */
export const deleteRoom = async (roomId: string): Promise<void> => {
  const redis = getRedisClient();
  const roomKey = getRoomKey(roomId);
  await redis.del(roomKey);
  console.log(`✅ Room ${roomId} deleted from Redis`);
};
