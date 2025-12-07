import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "./events";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const serverUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

    socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log("Connected to server:", socket?.id);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Disconnected from server");
    });

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.error("Connection error:", error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
