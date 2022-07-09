import { Socket  } from 'socket.io';
import { Room } from 'socket.io-adapter';

function join(socket: Socket) {
  return async (room: Room | Room[]) => {
    if (!(room instanceof Array)) {
      room = [room];
    }

    const sockets = await socket.nsp.allSockets();
    room = room.filter((it) => !sockets.has(it));

    socket.join(room);
  };
}

export default join;
