export type Env = 'prod' | 'staging' | 'dev';
export type ExperienceEventType =
  | 'fcp'
  | 'lcp'
  | 'cls'
  | 'inp'
  | 'longtask'
  | 'route'
  | 'react-render'
  | 'js-error'
  | 'promise-error'
  | 'react-error'
  | 'white-screen'
  | 'css-visibility-error'
  | 'css-covered'
  | string; // 允许插件扩展
export interface ExperienceEvent {
  type: ExperienceEventType;
  timestamp: number;
  value?: number;
  duration?: number;
  extra?: Record<string, any>;
}
export interface ExperienceContext {
  app: string;
  version: string;
  env: Env;
  route: string;
  userId?: string;
}
export interface InitCoreOptions {
  app: string;
  version: string;
  env: Env;
  reporter: (event: ExperienceEvent & ExperienceContext) => void;
  sampleRate?: number;
}
