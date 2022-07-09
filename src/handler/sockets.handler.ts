/* eslint-disable @typescript-eslint/no-shadow */
import {  Server } from 'socket.io';
import Router from 'koa-router';
import { BadRequest, NotFound } from 'http-errors';

import fetchNamespace from './fetch-namespace';

function sockets(io: Server): Record<'read' | 'delete', Router.IMiddleware> {
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
    delete: async (context, next) => {
      const socketId = context.params.socketId;
      if (socketId.length !== 20) {
        throw new BadRequest(`${socketId} length must to be 20.`);
      }
      const nsp = fetchNamespace(io, context.params.namespace);

      const sockets = await nsp.fetchSockets();

      const socket = sockets.find((it) => it.id === socketId);
      if (socket === null) {
        throw new NotFound(`${socketId} is not founded.`);
      }

      await socket?.disconnect();
      context.status = 204;

      await next();
    },
  };
}

export default sockets;