import io from "socket.io-client";

// Use environment variable for server URL, with fallback for production
const SERVER_URL =
  process.env.REACT_APP_SERVER_URL ||
  "https://cardclash-server-w935.onrender.com";

export default io(SERVER_URL, {
  transports: ["websocket"], // Prioritize WebSocket for real-time game
  reconnectionAttempts: 5, // Retry connection if it fails
});
