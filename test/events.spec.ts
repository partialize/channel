import { faker } from '@faker-js/faker';

import { Event } from '../dist/schema';

import createServer from './create-server';
import createClient from './create-client';
import createRequester from './create-requester';
import wrap from './wrap';
import called from './called';

describe('POST /{namespace}/events', () => {
  test('one room', wrap(async (done) => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const randomNamespace = faker.internet.domainWord();
    const randomRoom = faker.lorem.word();

    const socket = await createClient(config, `/${randomNamespace}`);

    const payload: Event = {
      name: 'hello',
      room: [randomRoom],
      arguments: ['world'],
    };

    socket.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });
    socket.emit('join-room', randomRoom);

    const response = await requester.post(`/${randomNamespace}/events`).send(payload);
    expect(response.status).toEqual(202);
  }));

  test('many room', wrap(async (done) => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const randomNamespace = faker.internet.domainWord();
    const randomRoom1 = faker.lorem.word();
    const randomRoom2 = faker.lorem.word();

    const socket1 = await createClient(config, `/${randomNamespace}`);
    const socket2 = await createClient(config, `/${randomNamespace}`);

    const call = called(2, () => done());

    const payload: Event = {
      name: 'hello',
      room: [randomRoom1, randomRoom2],
      arguments: ['world'],
    };

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

    const response = await requester.post(`/${randomNamespace}/events`).send(payload);
    expect(response.status).toEqual(202);
  }));

  test('all', wrap(async (done) => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const randomNamespace = faker.internet.domainWord();

    const socket = await createClient(config, `/${randomNamespace}`);

    const payload: Event = {
      name: 'hello',
      arguments: ['world'],
    };

    socket.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });

    const response = await requester.post(`/${randomNamespace}/events`).send(payload);
    expect(response.status).toEqual(202);
  }));
});

describe('POST /events', () => {
  test('one room', wrap(async (done) => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const randomRoom = faker.lorem.word();

    const socket = await createClient(config);

    const payload: Event = {
      name: 'hello',
      room: [randomRoom],
      arguments: ['world'],
    };

    socket.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });
    socket.emit('join-room', randomRoom);

    const response = await requester.post('/events').send(payload);
    expect(response.status).toEqual(202);
  }));

  test('many room', wrap(async (done) => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const randomRoom1 = faker.lorem.word();
    const randomRoom2 = faker.lorem.word();

    const socket1 = await createClient(config );
    const socket2 = await createClient(config );

    const call = called(2, () => done());

    const payload: Event = {
      name: 'hello',
      room: [randomRoom1, randomRoom2],
      arguments: ['world'],
    };

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

    const response = await requester.post('/events').send(payload);
    expect(response.status).toEqual(202);
  }));

  test('all', wrap(async (done) => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const socket = await createClient(config);

    const payload: Event = {
      name: 'hello',
      arguments: ['world'],
    };

    socket.on('hello', (arg) => {
      expect(arg).toEqual('world');
      done();
    });

    const response = await requester.post('/events').send(payload);
    expect(response.status).toEqual(202);
  }));
});
