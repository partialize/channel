import createClient from './create-client';
import createServer from './create-server';
import wrap from './wrap';

test('touch', wrap(async (done) => {
  const [io, config] = await createServer();

  const socket = await createClient(config);

  const serverSocket = io.sockets.sockets.get(socket.id);
  expect(serverSocket).not.toBeNull();

  Object.defineProperty(serverSocket?.data, 'expiredAt', {
    set(v: number) {
      const now = Date.now();
      expect(v).toBeGreaterThan(now);
      done();
    },
    get(): number {
      return 0;
    },
  });

  socket.emit('touch');
}), 1000);
