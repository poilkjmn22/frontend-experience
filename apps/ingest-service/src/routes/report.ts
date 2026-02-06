import { FastifyInstance } from 'fastify';
import { reportSchema } from '../schema/report';
import { shouldSample } from '../utils/sample';
import { normalize } from '../utils/normalize';
import { clickhouse } from '../plugins/clickhouse';
export async function reportRoute(app: FastifyInstance) {
  app.post('/api/experience/report', async (req, reply) => {
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid payload' });
    }
    const payload = parsed.data;
    if (!shouldSample(payload.sample)) {
      return reply.send({ ok: true, sampled: false });
    }
    await clickhouse.insert({
      table: 'events',
      values: [normalize(payload)],
      format: 'JSONEachRow',
    });
    reply.send({ ok: true });
  });
}
