import { Namespace } from 'socket.io';
import { Room } from 'socket.io-adapter';

function noticeJoin(space: Namespace) {
  return (room: Room, id: string) => {
    space.to(room).emit('join-room', room, id);
  };
}

export default noticeJoin;
