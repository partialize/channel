import { createServer } from 'http';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import Config, { ConfigProvider } from './config';
import { connect } from './handler';
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

  const space = io.of('/');

  space.use(age(io, config.age));
  space.on('connection', connect());

  if (config.port != null) {
    await io.listen(config.port);
  }
  return io;
}

export default bootstrap;
