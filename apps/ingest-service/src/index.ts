import { createServer } from './server';
import { env } from './env';
const app = createServer();
app.listen({ port: env.port, host: '0.0.0.0' });
