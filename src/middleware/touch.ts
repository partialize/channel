import { Socket  } from 'socket.io';

function touch(socket: Socket) {
  const age = socket.data.age;
  const now = Date.now();

  if (age != null) {
    socket.data.expiredAt = now + socket.data.age;
  }
}

export default touch;
