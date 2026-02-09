import { report } from '@whnz/frontend-experience-core';

let lastReportTime = 0;

interface LongTaskObserverInit {
  reportInterval?: number; // 上报间隔，默认 5000ms
  blockingThreshold?: number; // 阻塞时间阈值，默认 100ms
}

function initLongTaskObserver(options?: LongTaskObserverInit) {
  if (!PerformanceObserver.supportedEntryTypes.includes('longtask')) return;

  const observer = new PerformanceObserver((list) => {
    const now = performance.now();

    // 每 5s 最多上报一次
    if (now - lastReportTime < (options?.reportInterval || 5000)) return;

    const entries = list
      .getEntries()
      .filter((e) => e.duration > (options?.blockingThreshold || 100)); // 🔥 关键阈值

    if (!entries.length) return;

    const totalBlocking = entries.reduce(
      (sum, e) => sum + Math.max(0, e.duration - 50),
      0,
    );

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

export function longTaskPlugin() {
  return {
    name: 'longtask',
    setup() {
      initLongTaskObserver();
    },
  };
}
