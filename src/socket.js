import { io } from "socket.io-client";

let socket = null;

export function initSocket() {
  if (!socket) {
    socket = io(process.env.VUE_APP_API_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socket.on("connect", () => {
      console.log("✅ connected", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ connect_error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ disconnected:", reason);
    });
  }

  return socket;
}