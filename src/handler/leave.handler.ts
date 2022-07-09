import { Socket  } from 'socket.io';
import { Room } from 'socket.io-adapter';

function leave(socket: Socket) {
  return async (room: Room | Room[]) => {
    if (!(room instanceof Array)) {
      room = [room];
    }

    room = room.filter((it) => it !== socket.id);

    await Promise.all(room.map((it) => socket.leave(it)));
  };
}

export default leave;
