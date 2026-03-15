import { io } from "socket.io-client";

let socket = null;

export function initSocket(authData = {}) {
  if (!socket) {
    socket = io(process.env.VUE_APP_API_URL, {
      transports: ["polling", "websocket"], // fallback polling
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000,
      auth: authData
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect_error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });
  }

  return socket;
}