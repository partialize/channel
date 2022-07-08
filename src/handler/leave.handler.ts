import { Socket  } from 'socket.io';
import { Room } from 'socket.io-adapter';

function leave(socket: Socket) {
  return (room: Room) => {
    socket.leave(room);
  };
}

export default leave;
