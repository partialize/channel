import { Socket } from 'socket.io';
import { Room } from 'socket.io-adapter';

function broadcast(socket: Socket) {
  return (room: Room | null, ev: string, ...args: unknown[]) => {
    if (room === null) {
      socket.broadcast.emit(ev, ...args);
    } else {
      socket.to(room).emit(ev, ...args);
    }
  };
}

export default broadcast;
