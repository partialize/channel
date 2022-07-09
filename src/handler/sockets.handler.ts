/* eslint-disable @typescript-eslint/no-shadow */

import { Namespace, Server } from 'socket.io';
import Router from 'koa-router';

function fetchNamespace(io: Server, namespace: string): Namespace {
  if (namespace == null || namespace === '') {
    namespace = '/';
  }
  return io.of(namespace);
}

function sockets(io: Server): Record<'read', Router.IMiddleware> {
  return {
    read: async (context, next) => {
      const nsp = fetchNamespace(io, context.params.namespace);
      const sockets = await nsp.fetchSockets();

      context.body = sockets.map((socket) => {
        return {
          id: socket.id,
          room: Array.from(socket.rooms.values()),
          issuedAt: socket.handshake.issued,
          ...socket.data,
        };
      });

      await next();
    },
  };
}

export default sockets;