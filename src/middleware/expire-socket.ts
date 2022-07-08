import { Server } from 'socket.io';

function expireSocket(io: Server) {
  const now = Date.now();
  io.sockets.sockets.forEach((socket) => {
    const expiredAt = socket.data.expiredAt;
    if (expiredAt != null && expiredAt < now) {
      socket.disconnect();
    }
  });
}

export default expireSocket;
