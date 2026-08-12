import { Server } from "socket.io";
import { socketAuth } from "./socketAuth.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://devpulse-sf3s.vercel.app",
      ],
      credentials: true,
    },
  });

  // ====================================
  // Socket Authentication
  // ====================================

  io.use(socketAuth);

  // ====================================
  // Connection
  // ====================================

  io.on("connection", (socket) => {
    console.log(
      `🔌 Socket connected: ${socket.id}`
    );

    console.log(
      `👤 User connected: ${socket.user.username}`
    );

    socket.on("disconnect", (reason) => {
      console.log(
        `🔌 Socket disconnected: ${socket.id} — ${reason}`
      );
    });
  });

  console.log("⚡ Socket.IO initialized");

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
};