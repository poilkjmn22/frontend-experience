import { vitalsPlugin } from '@whnz/frontend-experience-vitals';
import { errorPlugin } from '@whnz/frontend-experience-error';
import { cssPlugin } from '@whnz/frontend-experience-css';
import { routePlugin } from './route';

export interface Plugin {
  name: string;
  setup(): void;
}

export interface SpaPresetOptions {
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
    routePlugin()
  ];
}
