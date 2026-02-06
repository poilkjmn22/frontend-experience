import { InitCoreOptions } from './types';
import { initContext } from './context';
import { initReporter } from './reporter';
import { initSampler } from './sampler';
import {initLongTaskObserver} from "./longtask";

let inited = false;
export function initCore(options: InitCoreOptions) {
  if (inited) return;
  inited = true;
  initContext({
    app: options.app,
    version: options.version,
    env: options.env,
    route: location.pathname,
  });
  initReporter(options.reporter);
  initSampler(options.sampleRate ?? 1);
  initLongTaskObserver();
}
