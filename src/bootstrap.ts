import { Server } from 'socket.io';

import Config, { ConfigProvider } from './config';

async function bootstrap(
  config: Config = new ConfigProvider().get(),
): Promise<Server> {
  const io = new Server();

  return io.listen(config.port);
}

export default bootstrap;
