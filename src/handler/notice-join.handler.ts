import { Server } from 'socket.io';
import { Room } from 'socket.io-adapter';

function noticeJoin(io: Server) {
  return (room: Room, id: string) => {
    io.to(room).emit('join-room', room, id);
  };
}

export default noticeJoin;
