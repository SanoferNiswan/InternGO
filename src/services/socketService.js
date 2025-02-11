import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080";

let socket;

export const connectSocket = (userId) => {
  socket = io(SOCKET_SERVER_URL);
 
  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    socket.emit("join", { userId });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};