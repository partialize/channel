import { Server, Socket } from 'socket.io';

import Namespaces from '../namespaces';

import join from './join.handler';
import leave from './leave.handler';
import broadcast from './broadcast.handler';
import noticeLeave from './notice-leave.handler';
import noticeJoin from './notice-join.handler';

function connect(io: Server) {
  const namespaces = new Namespaces(io);

  namespaces.on('create', (space, socket: Socket) => {
    // Manually publish events before the listener is registered.
    space.to(socket.id).emit('join-room', socket.id, socket.id);

    space.adapter.on('join-room', noticeJoin(space));
    space.adapter.on('leave-room', noticeLeave(space));
  });

  return (socket: Socket) => {
    socket.on('join-room', join(socket));
    socket.on('leave-room', leave(socket));

    socket.on('broadcast', broadcast(socket));
    socket.on('touch', () => {});

    namespaces.connect(socket);
  };
}

export default connect;
