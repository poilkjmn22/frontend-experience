type Env = 'prod' | 'staging' | 'dev';
type ExperienceEventType = 'fcp' | 'lcp' | 'cls' | 'inp' | 'longtask' | 'route' | 'react-render' | 'js-error' | 'promise-error' | 'react-error' | 'white-screen' | 'css-visibility-error' | 'css-covered' | string;
interface ExperienceEvent {
    type: ExperienceEventType;
    timestamp: number;
    value?: number;
    duration?: number;
    extra?: Record<string, any>;
}
interface ExperienceContext {
    app: string;
    version: string;
    env: Env;
    route: string;
    userId?: string;
}
interface InitCoreOptions {
    app: string;
    version: string;
    env: Env;
    reporter: (event: ExperienceEvent & ExperienceContext) => void;
    sampleRate?: number;
}

declare function initCore(options: InitCoreOptions): void;

declare function report(event: ExperienceEvent): void;

declare function setRoute(route: string): void;
declare function setUserId(userId: string): void;
declare function getContext(): ExperienceContext;

export { type Env, type ExperienceContext, type ExperienceEvent, type ExperienceEventType, type InitCoreOptions, getContext, initCore, report, setRoute, setUserId };
