import { faker } from '@faker-js/faker';

import createClient from './create-client';
import createServer from './create-server';

test('namespace', async () => {
  const [io, config] = await createServer();

  expect(io._nsps.size).toEqual(1);

  const randomNamespace = faker.name.findName();

  await createClient(config, `/${randomNamespace}`);
  expect(io._nsps.size).toEqual(2);

  await createClient(config, `/${randomNamespace}`);
  expect(io._nsps.size).toEqual(2);
});
