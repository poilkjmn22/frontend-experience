import { ExperienceContext } from './types';
const context: ExperienceContext = {
  app: '',
  version: '',
  env: 'prod',
  route: '/',
};
export function initContext(partial: Partial<ExperienceContext>) {
  Object.assign(context, partial);
}
export function setRoute(route: string) {
  context.route = route;
}
export function setDeviceInfo(ua: string, network: string) {
  context.device = { ua, network };
}
export function getContext(): ExperienceContext {
  return { ...context };
}
