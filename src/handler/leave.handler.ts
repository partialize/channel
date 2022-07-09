import { Socket  } from 'socket.io';
import { Room } from 'socket.io-adapter';

function leave(socket: Socket) {
  return (room: Room | Room[]) => {
    if (room instanceof Array) {
      room.forEach((it) => {
        socket.leave(it);
      });
    } else {
      socket.leave(room);
    }
  };
}

export default leave;
