import dotenv from 'dotenv';
import path from 'path';

import Config from './config';

if (process.env.NODE_ENV != null) {
  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
  });
} else {
  dotenv.config();
}

const environmentConfig: Partial<Config> = {};
if (process.env.PORT !== undefined) {
  environmentConfig.port = Number(process.env.PORT);
}
if (process.env.AGE !== undefined) {
  environmentConfig.age = Number(process.env.AGE);
}
if (process.env.REDIS_URL !== undefined) {
  environmentConfig.redis = { url: process.env.REDIS_URL };
}

export default environmentConfig;
