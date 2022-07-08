import bootstrap from './bootstrap';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { setupWorker } from '@socket.io/sticky';

bootstrap().then((io) => {
  setupWorker(io);
});
