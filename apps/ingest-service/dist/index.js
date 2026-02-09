// src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";

// src/schema/report.ts
import { z } from "zod";
var reportSchema = z.object({
  app: z.string(),
  env: z.string(),
  version: z.string().optional(),
  type: z.enum([
    "fcp",
    "lcp",
    "cls",
    "inp",
    "longtask",
    "route",
    "react-render",
    "js-error",
    "promise-error",
    "react-error",
    "white-screen",
    "css-visibility-error",
    "css-covered"
  ]),
  name: z.string().optional(),
  value: z.number().optional(),
  rating: z.string().optional(),
  route: z.string().optional(),
  component: z.string().optional(),
  message: z.string().optional(),
  stack: z.string().optional(),
  timestamp: z.number(),
  sample: z.number().optional(),
  device: z.object({ ua: z.string().optional(), network: z.string().optional() }).optional(),
  extra: z.string().optional()
});

// src/utils/sample.ts
function shouldSample(rate = 1) {
  if (rate >= 1) return true;
  if (rate <= 0) return false;
  return Math.random() < rate;
}

// src/utils/normalize.ts
function normalize(p) {
  return {
    app: p.app,
    env: p.env,
    version: p.version ?? "unknown",
    type: p.type,
    name: p.name ?? "",
    value: p.value ?? 0,
    rating: p.rating ?? "",
    route: p.route ?? "",
    component: p.component ?? "",
    message: p.message ?? "",
    stack: p.stack ?? "",
    timestamp: p.timestamp,
    sample: p.sample ?? 1,
    device: p.device ?? {},
    extra: typeof p.extra === "string" ? p.extra : JSON.stringify(p.extra)
  };
}

// src/plugins/clickhouse.ts
import { createClient } from "@clickhouse/client";

// src/env.ts
var env = {
  port: Number(process.env.PORT ?? 3e3),
  clickhouseHost: process.env.CLICKHOUSE_HOST ?? "http://localhost:9000",
  database: process.env.CLICKHOUSE_DB ?? "experience"
};

// src/plugins/clickhouse.ts
var clickhouse = createClient({
  host: env.clickhouseHost,
  database: env.database
});

// src/routes/report.ts
function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (e) {
      throw new Error("Invalid JSON");
    }
  }
}
async function reportRoute(app2) {
  app2.post("/api/experience/report", async (req, reply) => {
    const rawBody = parseBody(req.body);
    const parsed = reportSchema.safeParse(rawBody);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error });
    }
    const payload = parsed.data;
    if (!shouldSample(payload.sample)) {
      return reply.send({ ok: true, sampled: false });
    }
    await clickhouse.insert({
      table: "events",
      values: [normalize(payload)],
      format: "JSONEachRow"
    });
    reply.send({ ok: true });
  });
}

// src/server.ts
function createServer() {
  const app2 = Fastify({ logger: true });
  app2.register(cors, { origin: true });
  app2.register(reportRoute);
  return app2;
}

// src/index.ts
var app = createServer();
app.listen({ port: env.port, host: "0.0.0.0" });
//# sourceMappingURL=index.js.map