interface Plugin {
    name: string;
    setup(): void;
}
declare function vitalsPlugin(): Plugin;

export { type Plugin, vitalsPlugin };
