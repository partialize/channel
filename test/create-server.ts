import { Server } from 'socket.io';
import getPort from 'get-port';

import { bootstrap, ConfigProvider, Config } from '../src';

async function createServer(): Promise<[Server, Config]> {
  const configProvider = new ConfigProvider({
    port: await getPort(),
  });
  const config = configProvider.get();
  return [await bootstrap(config), config];
}

export default createServer;
