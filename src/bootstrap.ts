import { createServer } from 'http';
import { createClient } from 'redis';
import Koa from 'koa';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import Config, { ConfigProvider } from './config';
import Router from './router';
import { connect } from './handler';
import { age, serialize } from './middleware';

async function bootstrap(
  config: Config = new ConfigProvider().get(),
): Promise<Server> {
  const koa = new Koa();
  const server = createServer(koa.callback());
  const io = new Server(server, {
    transports: [ 'websocket' ],
  });

  const router = Router(io);

  koa.use(serialize());
  koa.use(router.routes());

  if (config.redis != null) {
    const pubClient = createClient({ url: config.redis.url });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));
  }

  const spaces = [io.of('/'), io.of(/.*?/)];

  const shareAge = age(io, config.age);
  const shareConnect = connect();

  spaces.forEach((space) => {
    space.use(shareAge);
    space.on('connection', shareConnect);
  });

  if (config.port != null) {
    await new Promise((resolve) => {
      server.listen(config.port, () => {
        resolve(undefined);
      });
    });
  }
  return io;
}

export default bootstrap;
