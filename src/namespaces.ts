import { Namespace, Server, Socket } from 'socket.io';

class Namespaces {
  private readonly activated = new Map<string, number>();

  private readonly connectListeners: ((nsp: Namespace, socket: Socket) => unknown)[] = [];

  private readonly disconnectListeners: ((nsp: Namespace, socket: Socket) => unknown)[] = [];

  constructor(private readonly io: Server) {
  }

  connect(socket: Socket) {
    const space = socket.nsp;
    this.activated.set(space.name, (this.activated.get(space.name) ?? 0) + 1);
    if (this.activated.get(space.name) === 1) {
      this.connectListeners.forEach((listener) => {
        listener(space, socket);
      });
    }

    socket.on('disconnect', () => {
      this.activated.set(space.name, (this.activated.get(space.name) ?? 0) - 1);
      if (this.activated.get(space.name) === 0) {
        this.disconnectListeners.forEach((listener) => {
          listener(space, socket);
        });
        space.adapter.removeAllListeners();
        this.io._nsps.delete(space.name);
      }
    });
  }

  on(ev: 'create' | 'destroy', listener: (nsp: Namespace, socket: Socket) => unknown) {
    if (ev === 'create') {
      this.connectListeners.push(listener);
    } else if (ev === 'destroy') {
      this.disconnectListeners.push(listener);
    }
  }
}

export default Namespaces;
