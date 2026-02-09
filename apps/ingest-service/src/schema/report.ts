import { z } from 'zod';
export const reportSchema = z.object({
  app: z.string(),
  env: z.string(),
  version: z.string().optional(),
  type: z.enum([
    'fcp',
    'lcp',
    'cls',
    'inp',
    'longtask',
    'route',
    'react-render',
    'js-error',
    'promise-error',
    'react-error',
    'white-screen',
    'css-visibility-error',
    'css-covered',
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
  device: z
    .object({ ua: z.string().optional(), network: z.string().optional() })
    .optional(),
  extra: z.string().optional(),
});
export type ReportPayload = z.infer<typeof reportSchema>;
