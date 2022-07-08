import { Socket } from 'socket.io';

import join from './join.handler';
import leave from './leave.handler';
import broadcast from './broadcast.handler';
import { noticeJoin, noticeLeave } from './index';

function connect() {
  const activated = new Set<string>();
  return (socket: Socket) => {
    socket.on('join-room', join(socket));
    socket.on('leave-room', leave(socket));

    socket.on('broadcast', broadcast(socket));
    socket.on('touch', () => {});

    const space = socket.nsp;
    if (!activated.has(space.name)) {
      activated.add(space.name);

      space.adapter.on('join-room', noticeJoin(space));
      space.adapter.on('leave-room', noticeLeave(space));
    }
  };
}

export default connect;
