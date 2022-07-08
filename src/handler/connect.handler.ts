import { Socket } from 'socket.io';

import join from './join.handler';
import leave from './leave.handler';
import broadcast from './broadcast.handler';

function connect() {
  return (socket: Socket) => {
    socket.on('join-room', join(socket));
    socket.on('leave-room', leave(socket));

    socket.on('broadcast', broadcast(socket));
    socket.on('touch', () => {});
  };
}

export default connect;
