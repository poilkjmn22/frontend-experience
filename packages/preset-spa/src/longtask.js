import { report } from '@whnz/frontend-experience-core';
let lastReportTime = 0;
function initLongTaskObserver(options) {
    if (!PerformanceObserver.supportedEntryTypes.includes('longtask'))
        return;
    const observer = new PerformanceObserver((list) => {
        const now = performance.now();
        // 每 5s 最多上报一次
        if (now - lastReportTime < ((options === null || options === void 0 ? void 0 : options.reportInterval) || 5000))
            return;
        const entries = list
            .getEntries()
            .filter((e) => e.duration > ((options === null || options === void 0 ? void 0 : options.blockingThreshold) || 100)); // 🔥 关键阈值
        if (!entries.length)
            return;
        const totalBlocking = entries.reduce((sum, e) => sum + Math.max(0, e.duration - 50), 0);
        report({
            type: 'longtask',
            duration: totalBlocking,
            timestamp: Date.now(),
            extra: {
                startTime: entries[0].startTime,
                blockingTime: totalBlocking,
                count: entries.length,
            }
        });
        lastReportTime = now;
    });
    observer.observe({ entryTypes: ['longtask'] });
}
export function longTaskPlugin(options) {
    return {
        name: 'longtask',
        setup() {
            initLongTaskObserver(options);
        },
    };
}
//# sourceMappingURL=longtask.js.map