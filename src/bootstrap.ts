import { Server } from 'socket.io';

import Config, { ConfigProvider } from './config';
import { connect, noticeJoin, noticeLeave } from './handler';
import { age } from './middleware';

async function bootstrap(
  config: Config = new ConfigProvider().get(),
): Promise<Server> {
  const io = new Server();

  io.use(age(io, config.age));

  io.on('connect', connect());

  io.of('/').adapter.on('join-room', noticeJoin(io));
  io.of('/').adapter.on('leave-room', noticeLeave(io));

  return io.listen(config.port);
}

export default bootstrap;
