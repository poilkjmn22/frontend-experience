interface Plugin {
    name: string;
    setup(): void;
}
interface SpaPresetOptions {
    keySelectors?: string[];
}
declare function spaPreset(options?: SpaPresetOptions): Plugin[];

export { type Plugin, type SpaPresetOptions, spaPreset };
