// src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";

// src/schema/report.ts
import { z } from "zod";
var baseEventSchema = {
  app: z.string(),
  env: z.string(),
  version: z.string().optional(),
  timestamp: z.number().int().positive(),
  route: z.string().optional(),
  sample: z.number().optional(),
  device: z.object({
    ua: z.string().optional(),
    network: z.string().optional()
  }).optional()
};
var reportSchema = z.object({
  ...baseEventSchema,
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
  /** 核心数值（ms / score） */
  value: z.number().optional(),
  /** duration 专用于 longtask / render / inp */
  duration: z.number().optional(),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  name: z.string().optional(),
  component: z.string().optional(),
  message: z.string().optional(),
  stack: z.string().optional(),
  /** 半结构化扩展字段 */
  extra: z.object({
    startTime: z.number().optional(),
    blockingTime: z.number().optional(),
    name: z.string().optional()
  }).passthrough().optional()
}).superRefine((data, ctx) => {
  if (data.type === "longtask" && data.duration == null) {
    ctx.addIssue({
      path: ["duration"],
      message: "longtask requires duration",
      code: z.ZodIssueCode.custom
    });
  }
  if (data.type === "fcp" && data.value == null) {
    ctx.addIssue({
      path: ["value"],
      message: "fcp requires value",
      code: z.ZodIssueCode.custom
    });
  }
});

// src/utils/normalize.ts
function normalize(payload) {
  return {
    app: payload.app,
    env: payload.env,
    version: payload.version ?? "",
    type: payload.type,
    name: payload.name ?? "",
    route: payload.route ?? "",
    component: payload.component ?? "",
    timestamp: new Date(payload.timestamp),
    value: payload.value ?? 0,
    duration: payload.duration ?? 0,
    rating: payload.rating ?? "",
    message: payload.message ?? "",
    stack: payload.stack ?? "",
    ua: payload.device?.ua ?? "",
    network: payload.device?.network ?? "",
    sample: payload.sample ?? 1,
    extra: JSON.stringify(payload.extra ?? {})
  };
}

// src/plugins/clickhouse.ts
import { createClient } from "@clickhouse/client";

// src/env.ts
var env = {
  port: Number(process.env.PORT ?? 3060),
  clickhouseHost: process.env.CLICKHOUSE_HOST ?? "http://localhost:8123",
  database: process.env.CLICKHOUSE_DB ?? "experience"
};

// src/plugins/clickhouse.ts
var clickhouse = createClient({
  host: env.clickhouseHost,
  database: env.database,
  username: "default",
  password: "123456"
});

// src/routes/report.ts
function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (e) {
      throw new Error("Invalid JSON body");
    }
  } else if (typeof body === "object" && body !== null) {
    return body;
  } else {
    throw new Error("Unsupported body type");
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
    console.dir(payload, { depth: null });
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
  app2.addContentTypeParser(
    "text/plain",
    { parseAs: "string" },
    (req, body, done) => {
      try {
        done(null, JSON.parse(body));
      } catch (e) {
        done(null, body);
      }
    }
  );
  app2.register(cors, { origin: true, methods: ["POST", "OPTIONS"] });
  app2.register(reportRoute);
  return app2;
}

// src/index.ts
var app = createServer();
app.listen({ port: env.port, host: "0.0.0.0" });
//# sourceMappingURL=index.js.map