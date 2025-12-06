import { createServer, IncomingMessage, ServerResponse } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const parsedUrl = parse(req.url!, true);
        await handle(req, res, parsedUrl);
      } catch (error) {
        console.error("Error occurred handling", req.url, error);
        res.statusCode = 500;
        res.end("internal server error");
      }
    }
  );

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);

      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Add a new card to the room
     */
    socket.on(
      "add-card",
      (data: {
        roomId: string;
        column: string;
        content: string;
        author: string;
      }) => {
        const cardData = {
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: data.content,
          author: data.author,
          column: data.column,
          createdAt: new Date().toISOString(),
        };

        io.to(data.roomId).emit("card-added", cardData);
        console.log(`Card added to room ${data.roomId}:`, cardData);
      }
    );

    /**
     * Update a card in the room
     */
    socket.on(
      "update-card",
      (data: { roomId: string; cardId: string; content: string }) => {
        io.to(data.roomId).emit("card-updated", {
          cardId: data.cardId,
          content: data.content,
          updatedAt: new Date().toISOString(),
        });
        console.log(`Card updated in room ${data.roomId}:`, data.cardId);
      }
    );

    /**
     * Delete a card from the room
     */
    socket.on("delete-card", (data: { roomId: string; cardId: string }) => {
      io.to(data.roomId).emit("card-deleted", {
        cardId: data.cardId,
        deletedAt: new Date().toISOString(),
      });
      console.log(`Card deleted in room ${data.roomId}:`, data.cardId);
    });

    /**
     * When the connection is disconnected
     */
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io server running on port ${port}`);
    });
});
