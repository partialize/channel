import { Server, Socket } from 'socket.io';

import join from './join.handler';
import leave from './leave.handler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function connect(io: Server) {
  return (socket: Socket) => {
    socket.on('join-room', join(socket));
    socket.on('leave-room', leave(socket));
  };
}

export default connect;