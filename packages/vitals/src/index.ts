import { onFCP, onLCP, onCLS, onINP } from 'web-vitals';
import { report } from '@whnz/frontend-experience-core';

export interface Plugin {
  name: string;
  setup(): void;
}

export function vitalsPlugin(): Plugin {
  return {
    name: 'vitals',
    setup() {
      onFCP((m) =>
        report({
          type: 'fcp',
          value: m.value,
          timestamp: Date.now(),
        }),
      );

      onLCP((m) =>
        report({
          type: 'lcp',
          value: m.value,
          timestamp: Date.now(),
          extra: {
            element: m.entries?.[0]?.element?.tagName,
          },
        }),
      );

      onCLS((m) =>
        report({
          type: 'cls',
          value: m.value,
          timestamp: Date.now(),
        }),
      );

      onINP((m) => {
        if (m.value > 200) {
          report({
            type: 'inp',
            value: m.value,
            timestamp: Date.now(),
          });
        }
      });
    },
  };
}
