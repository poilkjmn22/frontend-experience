import { getContext } from './context';
import { shouldSample } from './sampler';
let reporterFn = null;
export function initReporter(fn) {
    if (typeof fn === 'string') {
        reporterFn = (event) => {
            navigator.sendBeacon(fn, JSON.stringify(event));
        };
    }
    else {
        reporterFn = fn;
    }
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
        enqueue(payload);
    }
    catch (e) {
        // core 永远不能抛异常
    }
}
const queue = [];
let flushing = false;
function enqueue(payload) {
    queue.push(payload);
    scheduleFlush();
}
function scheduleFlush() {
    if (flushing)
        return;
    flushing = true;
    requestIdleCallback(() => {
        flush();
        flushing = false;
    }, { timeout: 2000 });
}
function flush() {
    if (!queue.length)
        return;
    const batch = queue.splice(0, 20);
    reporterFn === null || reporterFn === void 0 ? void 0 : reporterFn(batch.length === 1 ? batch[0] : batch);
}
//# sourceMappingURL=reporter.js.map