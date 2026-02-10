import { InitCoreOptions } from './types';
import { initContext } from './context';
import { initReporter } from './reporter';
import { initSampler } from './sampler';

let inited = false;
export function initCore(options: InitCoreOptions) {
  if (inited) return;
  inited = true;
  initContext({
    app: options.app,
    version: options.version,
    env: options.env,
    route: location.pathname,
    device: {
      ua: navigator.userAgent,
      network: (navigator as any).connection?.effectiveType || '',
    },
  });
  initReporter(options.reporter);
  initSampler(options.sample ?? 1);
}
