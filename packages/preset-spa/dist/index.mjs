import { vitalsPlugin } from '@whnz/frontend-experience-vitals';
import { errorPlugin } from '@whnz/frontend-experience-error';
import { cssPlugin } from '@whnz/frontend-experience-css';

// src/index.ts
function spaPreset(options = {}) {
  return [
    vitalsPlugin(),
    errorPlugin(),
    cssPlugin({
      keySelectors: options.keySelectors,
      detectWhiteScreen: true
    })
  ];
}

export { spaPreset };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map