import { vitalsPlugin } from '@whnz/frontend-experience-vitals';
import { errorPlugin } from '@whnz/frontend-experience-error';
import { cssPlugin } from '@whnz/frontend-experience-css';
export function spaPreset(options = {}) {
    return [
        vitalsPlugin(),
        errorPlugin(),
        cssPlugin({
            keySelectors: options.keySelectors,
            detectWhiteScreen: true
        })
    ];
}
//# sourceMappingURL=index.js.map