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

    // ====================================
    // Join Private User Room
    // ====================================

    const userRoom =
      `user:${socket.user._id.toString()}`;

    socket.join(userRoom);

    console.log(
      `🏠 User joined room: ${userRoom}`
    );

    // ====================================
    // Typing Started
    // ====================================

    socket.on(
      "typing_start",
      ({ conversationId }) => {
        if (!conversationId) {
          return;
        }

        console.log(
          `⌨️ ${socket.user.username} started typing in ${conversationId}`
        );

        // Find the other participant later
        // from the conversation room/event.
        socket.broadcast.emit(
          "user_typing",
          {
            conversationId,
            userId:
              socket.user._id.toString(),
            username:
              socket.user.username,
          }
        );
      }
    );

    // ====================================
    // Typing Stopped
    // ====================================

    socket.on(
      "typing_stop",
      ({ conversationId }) => {
        if (!conversationId) {
          return;
        }

        console.log(
          `⌨️ ${socket.user.username} stopped typing in ${conversationId}`
        );

        socket.broadcast.emit(
          "user_stopped_typing",
          {
            conversationId,
            userId:
              socket.user._id.toString(),
          }
        );
      }
    );

    // ====================================
    // Disconnect
    // ====================================

    socket.on("disconnect", (reason) => {
      console.log(
        `🔌 Socket disconnected: ${socket.id} — ${reason}`
      );
    });
  });

  console.log(
    "⚡ Socket.IO initialized"
  );

  return io;
};

// ====================================
// Get Socket.IO Instance
// ====================================

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
};