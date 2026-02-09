import Fastify from 'fastify';
import cors from '@fastify/cors';
import { reportRoute } from './routes/report';
export function createServer() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: ['http://localhost:5173'], methods: ['POST', 'OPTIONS'] });
  app.register(reportRoute);
  return app;
}
