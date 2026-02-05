import { initContext } from './context';
import { initReporter } from './reporter';
import { initSampler } from './sampler';
let inited = false;
export function initCore(options) {
    var _a;
    if (inited)
        return;
    inited = true;
    initContext({
        app: options.app,
        version: options.version,
        env: options.env,
        route: location.pathname,
    });
    initReporter(options.reporter);
    initSampler((_a = options.sampleRate) !== null && _a !== void 0 ? _a : 1);
}
//# sourceMappingURL=init.js.map