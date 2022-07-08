import { Server } from 'socket.io';

import Config, { ConfigProvider } from './config';
import { connect, noticeJoin, noticeLeave } from './handler';

async function bootstrap(
  config: Config = new ConfigProvider().get(),
): Promise<Server> {
  const io = new Server();

  io.on('connect', connect(io));

  io.of('/').adapter.on('join-room', noticeJoin(io));
  io.of('/').adapter.on('leave-room', noticeLeave(io));

  return io.listen(config.port);
}

export default bootstrap;
