import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://192.168.0.141:8080";

let socket;

export const connectSocket = (userId) => {
  if(socket){
    return socket;
  }
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