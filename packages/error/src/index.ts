import { report } from '@whnz/frontend-experience-core';

export interface Plugin {
  name: string;
  setup(): void;
}

export function errorPlugin(): Plugin {
  return {
    name: 'error',
    setup() {
      window.addEventListener('error', (event) => {
        report({
          type: 'js-error',
          timestamp: Date.now(),
          message: event.message,
          stack: event.error?.stack,
          extra: {
            file: event.filename,
            line: event.lineno,
            col: event.colno,
          },
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        report({
          type: 'promise-error',
          timestamp: Date.now(),
          extra: {
            reason: String(event.reason),
          },
        });
      });
    },
  };
}
