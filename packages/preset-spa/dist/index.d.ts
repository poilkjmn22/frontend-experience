interface LongTaskObserverInit {
    reportInterval?: number;
    blockingThreshold?: number;
}

interface Plugin {
    name: string;
    setup(): void;
}
interface SpaPresetOptions extends LongTaskObserverInit {
    keySelectors?: string[];
}
declare function spaPreset(options?: SpaPresetOptions): Plugin[];

export { type Plugin, type SpaPresetOptions, spaPreset };
