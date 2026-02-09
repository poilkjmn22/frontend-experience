export interface LongTaskObserverInit {
    reportInterval?: number;
    blockingThreshold?: number;
}
export declare function longTaskPlugin(options?: LongTaskObserverInit): {
    name: string;
    setup(): void;
};
//# sourceMappingURL=longtask.d.ts.map