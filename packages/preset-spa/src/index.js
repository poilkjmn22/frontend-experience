import { vitalsPlugin } from '@whnz/frontend-experience-vitals';
import { errorPlugin } from '@whnz/frontend-experience-error';
import { cssPlugin } from '@whnz/frontend-experience-css';
import { routePlugin } from './route';
import { longTaskPlugin } from './longtask';
export function spaPreset(options = {}) {
    return [
        vitalsPlugin(),
        errorPlugin(),
        cssPlugin({
            keySelectors: options.keySelectors,
            detectWhiteScreen: true
        }),
        routePlugin(),
        longTaskPlugin({
            reportInterval: options.reportInterval,
            blockingThreshold: options.blockingThreshold,
        }),
    ];
}
//# sourceMappingURL=index.js.map