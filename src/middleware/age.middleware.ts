/* eslint-disable @typescript-eslint/no-shadow */

import cron from 'node-cron';
import { Server } from 'socket.io';

import Middleware from './middleware';
import expireSocket from './expire-socket';
import touch from './touch';

function age(io: Server, age: number): Middleware {
  cron.schedule('* * * * *', () => {
    expireSocket(io);
  });
  
  return (socket, next) => {
    socket.data.age = age;
    touch(socket);

    socket.use((_, next) => {
      touch(socket);
      next();
    });
    
    next();
  };
}

export default age;