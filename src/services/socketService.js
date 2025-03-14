import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_BASE_URL;

let socket;

export const connectSocket = (userId) => {
  if(socket){
    return socket;
  }
  socket = io(SOCKET_SERVER_URL);
 
  socket.on("connect", () => {
    // console.log("Connected to WebSocket server");
    socket.emit("join", { userId });
  });

  socket.on("disconnect", () => {
    // console.log("Disconnected from WebSocket server");
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};