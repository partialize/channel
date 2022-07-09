/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Namespace, Server } from 'socket.io';

function fetchNamespace(io: Server, namespace: string): Namespace {
  if (namespace == null || namespace === '') {
    namespace = '/';
  }
  if (io._nsps.has(namespace)) {
    return io._nsps.get(namespace)!;
  }

  const nsp = io.of(namespace);
  io._nsps.delete(nsp.name);
  return nsp;
}

export default fetchNamespace;
