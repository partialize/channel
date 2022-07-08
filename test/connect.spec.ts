import createServer from './create-server';
import createClient from './create-client';

test('connect', async () => {
  const [, config] = await createServer();
  const socket = await createClient(config);
  expect(socket.connected).toBeTruthy();
});
