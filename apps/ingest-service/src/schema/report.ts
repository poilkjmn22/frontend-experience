import { z } from 'zod';

const baseEventSchema = {
  app: z.string(),
  env: z.string(),
  version: z.string().optional(),
  timestamp: z.number().int().positive(),
  route: z.string().optional(),
  sample: z.number().optional(),
  device: z
    .object({
      ua: z.string().optional(),
      network: z.string().optional(),
    })
    .optional(),
};

export const reportSchema = z
  .object({
    ...baseEventSchema,

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

    /** 核心数值（ms / score） */
    value: z.number().optional(),

    /** duration 专用于 longtask / render / inp */
    duration: z.number().optional(),

    rating: z.enum(['good', 'needs-improvement', 'poor']).optional(),

    name: z.string().optional(),
    component: z.string().optional(),

    message: z.string().optional(),
    stack: z.string().optional(),

    /** 半结构化扩展字段 */
    extra: z
      .object({
        startTime: z.number().optional(),
        blockingTime: z.number().optional(),
        name: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .superRefine((data, ctx) => {
    // 语义校验（非常重要）
    if (data.type === 'longtask' && data.duration == null) {
      ctx.addIssue({
        path: ['duration'],
        message: 'longtask requires duration',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.type === 'fcp' && data.value == null) {
      ctx.addIssue({
        path: ['value'],
        message: 'fcp requires value',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ReportPayload = z.infer<typeof reportSchema>;
