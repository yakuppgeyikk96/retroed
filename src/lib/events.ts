/**
 * Socket.io Event Names
 */

export const CLIENT_EVENTS = {
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  ADD_CARD: "add-card",
  UPDATE_CARD: "update-card",
  DELETE_CARD: "delete-card",
} as const;

export const SERVER_EVENTS = {
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",
  CARD_ADDED: "card-added",
  CARD_UPDATED: "card-updated",
  CARD_DELETED: "card-deleted",
  ROOM_JOINED: "room-joined",
} as const;

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
} as const;

export const EVENTS = {
  ...CLIENT_EVENTS,
  ...SERVER_EVENTS,
  ...SOCKET_EVENTS,
} as const;

export type ClientEvent = (typeof CLIENT_EVENTS)[keyof typeof CLIENT_EVENTS];
export type ServerEvent = (typeof SERVER_EVENTS)[keyof typeof SERVER_EVENTS];
export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
export type AllEvents = ClientEvent | ServerEvent | SocketEvent;
