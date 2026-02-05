import { ExperienceEvent } from './types';
import { getContext } from './context';
import { shouldSample } from './sampler';
let reporterFn: ((event: any) => void) | null = null;
export function initReporter(fn: (event: any) => void) {
  reporterFn = fn;
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
    reporterFn(payload);
  } catch (e) {
    // core 永远不能抛异常
  }
}
