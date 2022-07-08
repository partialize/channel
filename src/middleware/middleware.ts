import { Socket } from 'socket.io/dist/socket';
import { ExtendedError } from 'socket.io/dist/namespace';

type Middleware = (socket: Socket, next: (err?: ExtendedError) => void) => void;

export default Middleware;
