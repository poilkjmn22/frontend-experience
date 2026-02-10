import { FastifyInstance } from 'fastify';
import { reportSchema } from '../schema/report';
import { normalize } from '../utils/normalize';
import { clickhouse } from '../plugins/clickhouse';

function parseBody(body: unknown) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (e) {
      throw new Error('Invalid JSON body');
    }
  } else if (typeof body === 'object' && body !== null) {
    return body;
  } else {
    throw new Error('Unsupported body type');
  }
}
export async function reportRoute(app: FastifyInstance) {
  app.post('/api/experience/report', async (req, reply) => {
    const rawBody = parseBody(req.body);
    const parsed = reportSchema.safeParse(rawBody);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error });
    }
    const payload = parsed.data;
    console.dir(payload, {depth: null});
    await clickhouse.insert({
      table: 'events',
      values: [normalize(payload)],
      format: 'JSONEachRow',
    });
    reply.send({ ok: true });
  });
}
