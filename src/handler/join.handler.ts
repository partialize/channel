import { Socket  } from 'socket.io';
import { Room } from 'socket.io-adapter';

function join(socket: Socket) {
  return (room: Room) => {
    socket.join(room);
  };
}

export default join;
