import { Socket } from 'socket.io';

import Namespaces from '../namespaces';

import join from './join.handler';
import leave from './leave.handler';
import broadcast from './broadcast.handler';
import noticeLeave from './notice-leave.handler';
import noticeJoin from './notice-join.handler';

function connect() {
  const namespaces = new Namespaces();

  namespaces.on('create', (space, socket: Socket) => {
    // Manually publish events before the listener is registered.
    space.to(socket.id).emit('join-room', socket.id, socket.id);

    space.adapter.on('join-room', noticeJoin(space));
    space.adapter.on('leave-room', noticeLeave(space));
  });
  namespaces.on('destroy', (space) => {
    space.adapter.removeAllListeners();
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
