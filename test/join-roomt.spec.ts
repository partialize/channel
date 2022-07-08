import { Room } from 'socket.io-adapter';
import { faker } from '@faker-js/faker';

import createClient from './create-client';
import createServer from './create-server';
import wrap from './wrap';

test('join-room', wrap(async (done) => {
  const [, config] = await createServer();

  const socket = await createClient(config);

  const randomRoom = faker.name.findName();

  socket.on('join-room', (room: Room, id: string) => {
    expect(room).toEqual(randomRoom);
    expect(id).toEqual(socket.id);

    done();
  });

  socket.emit('join-room', randomRoom);
}), 1000);
