import { Room } from 'socket.io-adapter';
import { faker } from '@faker-js/faker';

import createClient from './create-client';
import createServer from './create-server';
import wrap from './wrap';

test('leave-room', wrap(async (done) => {
  const [, config] = await createServer();

  const socket1 = await createClient(config);
  const socket2 = await createClient(config);

  const randomRoom = faker.name.findName();

  socket1.on('leave-room', (room: Room, id: string) => {
    expect(room).toEqual(randomRoom);
    expect(id).toEqual(socket2.id);

    done();
  });

  socket1.emit('join-room', randomRoom);
  socket2.emit('join-room', randomRoom);

  socket2.emit('leave-room', randomRoom);
}), 1000);
