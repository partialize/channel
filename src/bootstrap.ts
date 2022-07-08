import { createServer } from 'http';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import Config, { ConfigProvider } from './config';
import { connect, noticeJoin, noticeLeave } from './handler';
import { age } from './middleware';

async function bootstrap(
  config: Config = new ConfigProvider().get(),
): Promise<Server> {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    transports: [ 'websocket' ],
  });

  if (config.redis != null) {
    const pubClient = createClient({ url: config.redis.url });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use(age(io, config.age));

  io.on('connect', connect());

  io.of('/').adapter.on('join-room', noticeJoin(io));
  io.of('/').adapter.on('leave-room', noticeLeave(io));

  if (config.port != null) {
    await io.listen(config.port);
  }
  return io;
}

export default bootstrap;
