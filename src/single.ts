import bootstrap from './bootstrap';
import { ConfigProvider } from './config';

const configProvider = new ConfigProvider();
const config = configProvider.get();

bootstrap(config).then();