import Client, { Socket } from 'socket.io-client';

import { Config } from '../src';

async function createClient(config: Config) {
  const client = Client(`http://localhost:${config.port}`, {
    transports: ['websocket'],
  });
  return new Promise<Socket>((resolve) => {
    client.on('connect', () => {
      resolve(client);
    });
  });
}

export default createClient;
