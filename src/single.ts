import bootstrap from './bootstrap';
import { ConfigProvider } from './config';

const configProvider = new ConfigProvider({
  port: 8080,
});
const config = configProvider.get();

bootstrap(config).then();