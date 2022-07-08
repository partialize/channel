import Client, { Socket } from 'socket.io-client';
import getPort from 'get-port';

import { bootstrap, ConfigProvider } from '../src';

async function createClient() {
  const configProvider = new ConfigProvider({
    port: await getPort(),
  });
  const config = configProvider.get();
  await bootstrap(config);

  const client = Client(`http://localhost:${config.port}`);

  return new Promise<Socket>((resolve) => {
    client.on('connect', () => {
      resolve(client);
    });
  });
}

export default createClient;
