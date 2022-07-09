import { faker } from '@faker-js/faker';

import createClient from './create-client';
import createServer from './create-server';
import wrap from './wrap';
import called from './called';

describe('broadcast', () => {
  test('one room', wrap(async (done) => {
    const [, config] = await createServer();

    const socket1 = await createClient(config);
    const socket2 = await createClient(config);

    const randomRoom = faker.name.findName();

    socket1.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });

    socket1.emit('join-room', randomRoom);

    socket2.emit('broadcast', randomRoom, 'hello', 'world');
  }));

  test('many room', wrap(async (done) => {
    const [, config] = await createServer();

    const socket1 = await createClient(config);
    const socket2 = await createClient(config);
    const socket3 = await createClient(config);

    const randomRoom1 = faker.name.findName();
    const randomRoom2 = faker.name.findName();

    const call = called(2, () => done());

    socket1.on('hello', (arg) => {
      expect(arg).toEqual('world');
      call();
    });
    socket2.on('hello', (arg) => {
      expect(arg).toEqual('world');
      call();
    });

    socket1.emit('join-room', randomRoom1);
    socket2.emit('join-room', randomRoom2);

    socket3.emit('broadcast', [randomRoom1, randomRoom2], 'hello', 'world');
  }));

  test('all', wrap(async (done) => {
    const [, config] = await createServer();

    const socket1 = await createClient(config);
    const socket2 = await createClient(config);

    socket1.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });

    socket2.emit('broadcast', null, 'hello', 'world');
  }));
});
