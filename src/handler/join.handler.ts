import { Socket  } from 'socket.io';
import { Room } from 'socket.io-adapter';

function join(socket: Socket) {
  return async (room: Room | Room[]) => {
    if (!(room instanceof Array)) {
      room = [room];
    }

    // Check room can be private room
    // https://socket.io/docs/v3/server-socket-instance/
    if (room.filter((it) => it.length === 20).length > 0) {
      const sockets = await socket.nsp.allSockets();
      room = room.filter((it) => !sockets.has(it));
    }

    await socket.join(room);
  };
}

export default join;
