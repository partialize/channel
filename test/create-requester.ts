/* eslint-disable @typescript-eslint/dot-notation */
import supertest from 'supertest';
import { Server } from 'socket.io';

async function createRequester(server: Server) {
  return supertest(server['httpServer']);
}

export default createRequester;
