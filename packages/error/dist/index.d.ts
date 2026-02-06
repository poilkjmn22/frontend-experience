interface Plugin {
    name: string;
    setup(): void;
}
declare function errorPlugin(): Plugin;

export { type Plugin, errorPlugin };
