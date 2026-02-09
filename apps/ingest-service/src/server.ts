import Fastify from 'fastify';
import cors from '@fastify/cors';
import { reportRoute } from './routes/report';
export function createServer() {
  const app = Fastify({ logger: true });
  app.addContentTypeParser(
    'text/plain',
    { parseAs: 'string' },
    (req, body, done) => {
      try {
        done(null, JSON.parse(body as string));
      } catch (e) {
        done(null, body);
      }
    },
  );
  app.register(cors, { origin: true, methods: ['POST', 'OPTIONS'] });
  app.register(reportRoute);
  return app;
}
