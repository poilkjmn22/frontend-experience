import { vitalsPlugin } from '@whnz/frontend-experience-vitals';
import { errorPlugin } from '@whnz/frontend-experience-error';
import { cssPlugin } from '@whnz/frontend-experience-css';
import { routePlugin } from './route';
import { longTaskPlugin , LongTaskObserverInit } from './longtask';

export interface Plugin {
  name: string;
  setup(): void;
}

export interface SpaPresetOptions extends LongTaskObserverInit {
  keySelectors?: string[];
}

export function spaPreset(
  options: SpaPresetOptions = {}
): Plugin[] {
  return [
    vitalsPlugin(),
    errorPlugin(),
    cssPlugin({
      keySelectors: options.keySelectors,
      detectWhiteScreen: true
    }),
    routePlugin(),
    longTaskPlugin({
      reportInterval: options.reportInterval,
      blockingThreshold: options.blockingThreshold,
    }),
  ];
}
