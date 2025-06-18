import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "redis";

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Redis setup
const redisClient = createClient();
redisClient.connect().catch(console.error);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    try {
      const key = `room:${roomId}:code`;
      const savedCode = await redisClient.get(key);
      if (savedCode) {
        socket.emit("code-update", { code: savedCode });
      }
    } catch (err) {
      console.error("Error fetching from Redis:", err);
    }
  });

  socket.on("code-change", async ({ roomId, code }) => {
    try {
      const key = `room:${roomId}:code`;
      await redisClient.set(key, code);
    } catch (err) {
      console.error("Error writing to Redis:", err);
    }

    socket.to(roomId).emit("code-update", { code });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Socket.IO server running on port 5000");
});
