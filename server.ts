import { createServer, IncomingMessage, ServerResponse } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { parse } from "url";
import { registerHandlers } from "./server/handlers";
import { getRedisClient } from "./server/lib/redis";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  try {
    getRedisClient();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    console.warn("⚠️ Continuing without Redis (some features may not work)");
  }

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

    registerHandlers(socket, io);
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
