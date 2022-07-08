/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from 'socket.io';

import join from './join.handler';
import leave from './leave.handler';
import broadcast from './broadcast.handler';
import { noticeJoin, noticeLeave } from './index';

function connect() {
  const activated = new Map<string, number>();
  const noticeJoins = new Map<string, (...args: any[]) => void>();
  const noticeLeaves = new Map<string, (...args: any[]) => void>();

  return (socket: Socket) => {
    socket.on('join-room', join(socket));
    socket.on('leave-room', leave(socket));

    socket.on('broadcast', broadcast(socket));
    socket.on('touch', () => {});

    const space = socket.nsp;
    activated.set(space.name, (activated.get(space.name) ?? 0) + 1);
    if (activated.get(space.name) === 1) {
      const localNoticeJoin = noticeJoin(space);
      const localNoticeLeave = noticeLeave(space);

      noticeJoins.set(space.name, localNoticeJoin);
      noticeLeaves.set(space.name, localNoticeLeave);

      // Manually publish events before the listener is registered.
      localNoticeJoin(socket.id, socket.id);

      space.adapter.on('join-room', localNoticeJoin);
      space.adapter.on('leave-room', localNoticeLeave);
    }

    socket.on('disconnect', () => {
      activated.set(space.name, (activated.get(space.name) ?? 0) - 1);
      if (activated.get(space.name) === 0) {
        const localNoticeJoin = noticeJoins.get(space.name);
        const localNoticeLeave = noticeLeaves.get(space.name);

        if (localNoticeJoin != null) {
          space.adapter.off('join-room', localNoticeJoin);
        }
        if (localNoticeLeave != null) {
          space.adapter.off('leave-room', localNoticeLeave);
        }

        noticeJoins.delete(space.name);
        noticeLeaves.delete(space.name);
        activated.delete(space.name);
      }
    });
  };
}

export default connect;
