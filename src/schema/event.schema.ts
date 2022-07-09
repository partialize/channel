import Joi from 'joi';
import { Room } from 'socket.io-adapter';

const event = Joi.object({
  name: Joi.string().required(),
  room: Joi.array().items(Joi.string()).optional(),
  arguments: Joi.array().optional(),
}).required();

type Event = {
  name: string;
  room?: Room[];
  arguments?: unknown[];
};

export { Event };
export default event;
