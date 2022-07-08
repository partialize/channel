import cron from 'node-cron';
import { Server } from 'socket.io';

import Middleware from './middleware';
import expireSocket from './expire-socket';
import touch from './touch';

// eslint-disable-next-line @typescript-eslint/no-shadow
function age(io: Server, age: number): Middleware {
  cron.schedule('* * * * *', () => {
    expireSocket(io);
  });
  
  return (socket, next) => {
    socket.data.age = age;
    touch(socket);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    socket.use((_, next) => {
      touch(socket);
      next();
    });
    
    next();
  };
}

export default age;