import { Room } from 'socket.io-adapter';
import { faker } from '@faker-js/faker';

import createClient from './create-client';
import createServer from './create-server';
import wrap from './wrap';
import called from './called';

describe('join-room', () => {
  test('one room', wrap(async (done) => {
    const [, config] = await createServer();

    const socket = await createClient(config);

    const randomRoom = faker.name.findName();

    socket.on('join-room', (room: Room, id: string) => {
      if (room == id) {
        return;
      }
      expect(room).toEqual(randomRoom);
      expect(id).toEqual(socket.id);
      done();
    });

    socket.emit('join-room', randomRoom);
  }));

  test('many room', wrap(async (done) => {
    const [, config] = await createServer();

    const socket = await createClient(config);

    const randomRoom1 = faker.name.findName();
    const randomRoom2 = faker.name.findName();

    const call = called(2, () => done());

    socket.on('join-room', (room: Room, id: string) => {
      if (room == id) {
        return;
      }
      expect([randomRoom1, randomRoom2]).toContain(room);
      expect(id).toEqual(socket.id);
      call();
    });

    socket.emit('join-room', [randomRoom1, randomRoom2]);
  }));
});
