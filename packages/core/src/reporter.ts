import { ExperienceEvent } from './types';
import { getContext } from './context';
import { shouldSample } from './sampler';
let reporterFn: ((event: any) => void) | null = null;
export function initReporter(fn: string | ((event: any) => void)) {
  if (typeof fn === 'string') {
    reporterFn = (event) => {
      navigator.sendBeacon(fn, JSON.stringify(event));
    };
  } else {
    reporterFn = fn;
  }
}
export function report(event: ExperienceEvent) {
  if (!reporterFn) return;
  if (!shouldSample()) return;
  const payload = {
    ...event,
    ...getContext(),
    timestamp: event.timestamp || Date.now(),
  };
  try {
    enqueue(payload);
  } catch (e) {
    // core 永远不能抛异常
  }
}
const queue: any[] = [];
let flushing = false;

function enqueue(payload: any) {
  queue.push(payload);
  scheduleFlush();
}

function scheduleFlush() {
  if (flushing) return;
  flushing = true;

  requestIdleCallback(
    () => {
      flush();
      flushing = false;
    },
    { timeout: 2000 },
  );
}

function flush() {
  if (!queue.length) return;
  const batch = queue.splice(0, 20);
  reporterFn?.(batch.length === 1 ? batch[0] : batch);
}
