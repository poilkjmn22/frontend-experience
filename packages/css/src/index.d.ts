export interface Plugin {
    name: string;
    setup(): void;
}
export interface CssPluginOptions {
    keySelectors?: string[];
    detectWhiteScreen?: boolean;
}
export declare function cssPlugin(options?: CssPluginOptions): Plugin;
//# sourceMappingURL=index.d.ts.map