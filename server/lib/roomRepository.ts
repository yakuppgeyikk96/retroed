import { RetroCard } from "@/lib/types";
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

/**
 * Add new attendee to room
 */
export const addAttendee = async (
  roomId: string,
  socketId: string
): Promise<void> => {
  const redisClient = getRedisClient();
  const roomKey = getRoomKey(roomId);

  // Get existing attendees
  const attendeesStr = await redisClient.hget(roomKey, "attendees");
  const attendees: string[] = attendeesStr ? JSON.parse(attendeesStr) : [];

  // If attendee doesn't exist, add them
  if (!attendees.includes(socketId)) {
    attendees.push(socketId);

    const now = new Date().toISOString();

    await redisClient.hset(roomKey, {
      attendees: JSON.stringify(attendees),
      updatedAt: now,
    });

    console.log(`✅ Attendee ${socketId} added to room ${roomId}`);
  }
};

/**
 * Remove attendee from room
 */
export const removeAttendee = async (
  roomId: string,
  socketId: string
): Promise<void> => {
  const redis = getRedisClient();
  const roomKey = getRoomKey(roomId);

  // Get existing attendees
  const attendeesStr = await redis.hget(roomKey, "attendees");
  const attendees: string[] = JSON.parse(attendeesStr || "[]");

  // Remove attendee from list
  const filteredAttendees = attendees.filter((id) => id !== socketId);

  if (filteredAttendees.length !== attendees.length) {
    const now = new Date().toISOString();

    await redis.hset(roomKey, {
      attendees: JSON.stringify(filteredAttendees),
      updatedAt: now,
    });

    console.log(`✅ Attendee ${socketId} removed from room ${roomId}`);
  }
};

export const addCardToRoom = async (
  roomId: string,
  card: RetroCard
): Promise<void> => {
  const redisClient = getRedisClient();
  const roomKey = getRoomKey(roomId);

  // Get existing cards
  const cardsStr = await redisClient.hget(roomKey, "cards");
  const cards: RetroCard[] = cardsStr ? JSON.parse(cardsStr) : [];

  // Add new card to list
  cards.push(card);

  const now = new Date().toISOString();

  await redisClient.hset(roomKey, {
    cards: JSON.stringify(cards),
    updatedAt: now,
  });

  console.log(`✅ Card ${card.id} added to room ${roomId}`);
};
