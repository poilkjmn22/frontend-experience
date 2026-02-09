import { LongTaskObserverInit } from './longtask';
export interface Plugin {
    name: string;
    setup(): void;
}
export interface SpaPresetOptions extends LongTaskObserverInit {
    keySelectors?: string[];
}
export declare function spaPreset(options?: SpaPresetOptions): Plugin[];
//# sourceMappingURL=index.d.ts.map