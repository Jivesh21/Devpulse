import dotenv from "dotenv";
import http from "http";
import { initializeSocket } from "./socket/index.js";
dotenv.config({
  path: "./.env",
});

console.log("NODE_ENV =", process.env.NODE_ENV);

const { default: app } = await import("./app.js");
const { default: connectDB } = await import(
  "./config/db.js"
);

const PORT = process.env.PORT || 5000;

// ====================================
// HTTP Server
// ====================================

const server = http.createServer(app);

// ====================================
// Start Server
// ====================================

const startServer = async () => {
  try {
await connectDB();

initializeSocket(server);

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  }
};

startServer();