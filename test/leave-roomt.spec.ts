import { Room } from 'socket.io-adapter';
import { faker } from '@faker-js/faker';

import createClient from './create-client';
import createServer from './create-server';
import wrap from './wrap';
import called from './called';

describe('leave-room', () => {
  test('one room', wrap(async (done) => {
    const [, config] = await createServer();

    const socket1 = await createClient(config);
    const socket2 = await createClient(config);

    const randomRoom = faker.name.findName();

    socket1.on('leave-room', (room: Room, id: string) => {
      if (room == id) {
        return;
      }
      expect(room).toEqual(randomRoom);
      expect(id).toEqual(socket2.id);
      done();
    });

    socket1.emit('join-room', randomRoom);
    socket2.emit('join-room', randomRoom);

    socket2.emit('leave-room', randomRoom);
  }));

  test('multi room', wrap(async (done) => {
    const [, config] = await createServer();

    const socket1 = await createClient(config);
    const socket2 = await createClient(config);

    const randomRoom1 = faker.name.findName();
    const randomRoom2 = faker.name.findName();

    const call = called(2, () => done());

    socket1.on('leave-room', (room: Room, id: string) => {
      if (room == id) {
        return;
      }
      expect([randomRoom1, randomRoom2]).toContain(room);
      expect(id).toEqual(socket2.id);
      call();
    });

    socket1.emit('join-room', [randomRoom1, randomRoom2]);
    socket2.emit('join-room', [randomRoom1, randomRoom2]);

    socket2.emit('leave-room', [randomRoom1, randomRoom2]);
  }));
});