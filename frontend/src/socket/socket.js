import { io } from "socket.io-client";
import api from "@/api/axios";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

// ====================================
// Connect Socket
// ====================================

export const connectSocket = async () => {
  try {
    // ====================================
    // Refresh Authentication First
    // ====================================

    await api.post("/auth/refresh-token");

    console.log(
      "✅ Access token refreshed before Socket.IO connection"
    );

    // ====================================
    // Connect Socket.IO
    // ====================================

    if (!socket.connected) {
      console.log(
        "🔌 Connecting Socket.IO..."
      );

      socket.connect();
    }
  } catch (error) {
    console.error(
      "❌ Unable to refresh authentication before Socket.IO connection:",
      error
    );
  }
};

// ====================================
// Disconnect Socket
// ====================================

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log(
      "🔌 Disconnecting Socket.IO..."
    );

    socket.disconnect();
  }
};

// ====================================
// Socket Events
// ====================================

socket.on("connect", () => {
  console.log(
    `🔌 Socket connected: ${socket.id}`
  );
});

socket.on("connect_error", (error) => {
  console.error(
    "❌ Socket connection error:",
    error.message
  );
});

socket.on("disconnect", (reason) => {
  console.log(
    `🔌 Socket disconnected: ${reason}`
  );
});

// ====================================
// New Message Event
// ====================================
socket.on("new_message", (message) => {
  console.log(
    "💬 New message received:",
    message
  );
});
// ====================================
// New Notification Event
// ====================================
socket.on("new_notification", (notification) => {
  console.log(
    "🔔 New notification received:",
    notification
  );
});