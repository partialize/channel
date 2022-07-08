import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

import Config, { ConfigProvider } from './config';
import { connect, noticeJoin, noticeLeave } from './handler';
import { age } from './middleware';

async function bootstrap(
  config: Config = new ConfigProvider().get(),
): Promise<Server> {
  const io = new Server({
    transports: [ 'websocket', 'polling' ],
  });

  if (config.redis != null) {
    const pubClient = createClient({ url: config.redis.url });
    const subClient = pubClient.duplicate();

    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use(age(io, config.age));

  io.on('connect', connect());

  io.of('/').adapter.on('join-room', noticeJoin(io));
  io.of('/').adapter.on('leave-room', noticeLeave(io));

  return io.listen(config.port);
}

export default bootstrap;
