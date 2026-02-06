import { z } from 'zod';
export const reportSchema = z.object({
  app: z.string(),
  env: z.string(),
  version: z.string().optional(),
  type: z.enum(['vitals', 'error', 'longtask', 'route', 'css']),
  name: z.string(),
  value: z.number().optional(),
  rating: z.string().optional(),
  route: z.string().optional(),
  component: z.string().optional(),
  message: z.string().optional(),
  stack: z.string().optional(),
  ts: z.number(),
  sample: z.number().optional(),
  device: z
    .object({ ua: z.string().optional(), network: z.string().optional() })
    .optional(),
});
export type ReportPayload = z.infer<typeof reportSchema>;
