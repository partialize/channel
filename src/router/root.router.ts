import { Context } from 'koa';
import Router from 'koa-router';
import { Server } from 'socket.io';

import { sockets as Sockets } from '../handler';

function rootRouter(io: Server): Router<unknown, Context> {
  const router = new Router<unknown, Context>();

  const sockets = Sockets(io);

  router.get(/(?<namespace>.*)\/sockets/, sockets.read);

  return router;
}
export default rootRouter;
