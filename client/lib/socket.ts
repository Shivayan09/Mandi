import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_GATEWAY_URL!, {
  path: "/chat/socket.io",
  withCredentials: true,
  autoConnect: false,
});

export default socket;