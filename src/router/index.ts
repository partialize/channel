/* eslint-disable @typescript-eslint/no-shadow */
import { Context } from 'koa';
import Router from 'koa-router';
import { Server } from 'socket.io';

import { sockets as Sockets, events as Events } from '../handler';

function router(io: Server): Router<unknown, Context> {
  const router = new Router<unknown, Context>();

  const sockets = Sockets(io);
  const events = Events(io);

  router.get(/(?<namespace>.*)\/sockets/, sockets.read);
  router.delete(/(?<namespace>.*)\/sockets\/(?<socketId>[^/]+)/, sockets.delete);

  router.post(/(?<namespace>.*)\/events/, events.create);

  return router;
}
export default router;
