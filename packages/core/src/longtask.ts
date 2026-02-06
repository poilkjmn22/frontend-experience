import { report } from './reporter';

export function initLongTaskObserver() {
  if (
    typeof PerformanceObserver === 'undefined' ||
    !PerformanceObserver.supportedEntryTypes.includes('longtask')
  ) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as PerformanceEntry[]) {
      const anyEntry = entry as any;
      const attribution = anyEntry.attribution?.[0];

      report({
        type: 'longtask',
        duration: entry.duration,
        timestamp: Date.now(),
        extra: {
          startTime: entry.startTime,
          blockingTime: Math.max(0, entry.duration - 50),
          name: attribution?.name,
          containerType: attribution?.containerType,
        },
      });
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
}
