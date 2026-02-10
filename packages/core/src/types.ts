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
  rating?: 'good' | 'needs-improvement' | 'poor';
  name?: string;
  component?: string;
  message?: string;
  stack?: string;
  extra?: Record<string, any>;
}
export interface ExperienceContext {
  app: string;
  env: Env;
  version?: string;
  route?: string;
  device?: {
    ua?: string;
    network?: string;
  };
}
export interface InitCoreOptions {
  app: string;
  version: string;
  env: Env;
  reporter: string | ((event: ExperienceEvent & ExperienceContext) => void);
  sample?: number;
}
