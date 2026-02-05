import { report } from '@whnz/frontend-experience-core';

export interface Plugin {
  name: string;
  setup(): void;
}

export interface CssPluginOptions {
  keySelectors?: string[];
  detectWhiteScreen?: boolean;
}

function detectWhiteScreen(delay = 3000) {
  setTimeout(() => {
    const elements = document.elementsFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );

    const isWhite = elements.every((el) =>
      ['HTML', 'BODY'].includes(el.tagName),
    );

    if (isWhite) {
      report({
        type: 'white-screen',
        timestamp: Date.now(),
      });
    }
  }, delay);
}

function checkVisibility(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const visible =
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight;

  if (!visible) {
    report({
      type: 'css-visibility-error',
      timestamp: Date.now(),
      extra: { selector },
    });
  }
}

export function cssPlugin(options: CssPluginOptions = {}): Plugin {
  return {
    name: 'css',
    setup() {
      if (options.detectWhiteScreen !== false) {
        detectWhiteScreen();
      }

      if (options.keySelectors?.length) {
        requestIdleCallback(() => {
          options.keySelectors!.forEach(checkVisibility);
        });
      }
    },
  };
}
