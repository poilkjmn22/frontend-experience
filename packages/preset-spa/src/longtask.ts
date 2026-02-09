import { report } from '@whnz/frontend-experience-core';

export interface LongTaskObserverInit {
  blockingThreshold?: number; // 阻塞时间阈值，默认 50ms
}

function initLongTaskObserver(options?: LongTaskObserverInit) {
  if (!PerformanceObserver.supportedEntryTypes.includes('longtask')) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list
      .getEntries()
      .filter((e) => e.duration > (options?.blockingThreshold || 50)); // 🔥 关键阈值

    if (!entries.length) return;
    entries.forEach((entry) => {
      // console.log(entry, 'longtask entry');
      report({
        type: 'longtask',
        duration: entry.duration,
        timestamp: Date.now(),
        extra: {
          startTime: entry.startTime,
          blockingTime: Math.max(
            0,
            entry.duration - (options?.blockingThreshold || 50),
          ),
          name: entry.name,
        },
      });
    });
  });

  observer.observe({ entryTypes: ['longtask'] });
}

export function longTaskPlugin(options?: LongTaskObserverInit) {
  return {
    name: 'longtask',
    setup() {
      initLongTaskObserver(options);
    },
  };
}
