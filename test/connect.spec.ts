import createClient from './create-client';

test('connect', async () => {
  const socket = await createClient();
  expect(socket.active).toBeTruthy();
});
