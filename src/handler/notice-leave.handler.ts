import { Server } from 'socket.io';
import { Room } from 'socket.io-adapter';

function noticeLeave(io: Server) {
  return (room: Room, id: string) => {
    io.to(room).emit('leave-room', room, id);
  };
}

export default noticeLeave;
