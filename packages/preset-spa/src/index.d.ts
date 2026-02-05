export interface Plugin {
    name: string;
    setup(): void;
}
export interface SpaPresetOptions {
    keySelectors?: string[];
}
export declare function spaPreset(options?: SpaPresetOptions): Plugin[];
//# sourceMappingURL=index.d.ts.map