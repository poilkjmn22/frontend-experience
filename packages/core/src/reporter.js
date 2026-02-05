import { getContext } from './context';
import { shouldSample } from './sampler';
let reporterFn = null;
export function initReporter(fn) {
    reporterFn = fn;
}
export function report(event) {
    if (!reporterFn)
        return;
    if (!shouldSample())
        return;
    const payload = {
        ...event,
        ...getContext(),
        timestamp: event.timestamp || Date.now(),
    };
    try {
        reporterFn(payload);
    }
    catch (e) {
        // core 永远不能抛异常
    }
}
//# sourceMappingURL=reporter.js.map