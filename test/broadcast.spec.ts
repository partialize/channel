import { faker } from '@faker-js/faker';

import createClient from './create-client';
import createServer from './create-server';
import wrap from './wrap';

describe('broadcast', () => {
  test('room', wrap(async (done) => {
    const [, config] = await createServer();

    const socket1 = await createClient(config);
    const socket2 = await createClient(config);

    const randomRoom = faker.name.findName();

    socket1.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });

    socket1.emit('join-room', randomRoom);
    socket2.emit('join-room', randomRoom);

    socket2.emit('broadcast', randomRoom, 'hello', 'world');
  }), 1000);

  test('all', wrap(async (done) => {
    const [, config] = await createServer();

    const socket1 = await createClient(config);
    const socket2 = await createClient(config);

    socket1.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });

    socket2.emit('broadcast', null, 'hello', 'world');
  }), 1000);
});
