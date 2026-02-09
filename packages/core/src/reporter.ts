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
  console.log('reporting event', event);
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

let scheduled = false;
let flushing = false;

function enqueue(payload: any) {
  queue.push(payload);
  scheduleFlush();
}

function scheduleFlush() {
  if (scheduled) return;
  scheduled = true;

  setTimeout(
    () => {
      scheduled = false;
      flushLoop();
    },
    1000,
  );
}

function flushLoop() {
  if (flushing) return;
  flushing = true;

  try {
    while (queue.length) {
      const batch = queue.splice(0, 20);
      reporterFn?.(batch.length === 1 ? batch[0] : batch);

      // 给浏览器一次喘息机会（避免长任务）
      if (queue.length) {
        scheduleFlush();
        break;
      }
    }
  } finally {
    flushing = false;
  }
}

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    flushSync();
  }
});

function flushSync() {
  if (!queue.length) return;
  const batch = queue.splice(0);
  reporterFn?.(batch);
}
