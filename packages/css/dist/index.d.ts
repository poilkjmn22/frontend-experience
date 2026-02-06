interface Plugin {
    name: string;
    setup(): void;
}
interface CssPluginOptions {
    keySelectors?: string[];
    detectWhiteScreen?: boolean;
}
declare function cssPlugin(options?: CssPluginOptions): Plugin;

export { type CssPluginOptions, type Plugin, cssPlugin };
