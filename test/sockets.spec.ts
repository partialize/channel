import { faker } from '@faker-js/faker';

import createServer from './create-server';
import createClient from './create-client';
import createRequester from './create-requester';

describe('GET /{namespace}/sockets', () => {
  test('success', async () => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const randomNamespace = faker.internet.domainWord();
    const socket = await createClient(config, `/${randomNamespace}`);

    const response = await requester.get(`/${randomNamespace}/sockets`);
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toEqual(socket.id);
  });
});

describe('GET /sockets', () => {
  test('success', async () => {
    const [server, config] = await createServer();
    const requester = await createRequester(server);

    const socket = await createClient(config);

    const response = await requester.get('/sockets');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toEqual(socket.id);
  });
});