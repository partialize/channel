import { Namespace } from 'socket.io';
import { Room } from 'socket.io-adapter';

function noticeLeave(space: Namespace) {
  return (room: Room, id: string) => {
    space.to(room).emit('leave-room', room, id);
  };
}

export default noticeLeave;
