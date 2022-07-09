import { Socket  } from 'socket.io';
import { Room } from 'socket.io-adapter';

function leave(socket: Socket) {
  return (room: Room | Room[]) => {
    if (!(room instanceof Array)) {
      room = [room];
    }

    room = room.filter((it) => it !== socket.id);

    room.forEach((it) => {
      socket.leave(it);
    });
  };
}

export default leave;
