/* eslint-disable @typescript-eslint/no-shadow,@typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any,max-len */
import { Server } from 'socket.io';
import Router from 'koa-router';

import fetchNamespace from './fetch-namespace';
import { event, Event } from '../schema';
import { BadRequest } from 'http-errors';

function events(io: Server): Record<'create', Router.IMiddleware> {
  return {
    create: async (context, next) => {
      const payload: Event = context.request.body;
      try {
        await event.validateAsync(payload);
      } catch (e: any) {
        throw new BadRequest(e.message);
      }

      const nsp = fetchNamespace(io, context.params.namespace);
      if (payload.room != null) {
        nsp.to(payload.room).emit(payload.name, ...(payload.arguments ?? []));
      } else {
        nsp.emit(payload.name, ...(payload.arguments ?? []));
      }

      context.status = 202;

      await next();
    },
  };
}

export default events;