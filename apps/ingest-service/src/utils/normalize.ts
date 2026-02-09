import { ReportPayload } from '../schema/report';
export function normalize(p: ReportPayload) {
  return {
    app: p.app,
    env: p.env,
    version: p.version ?? 'unknown',
    type: p.type,
    name: p.name ?? '',
    value: p.value ?? 0,
    rating: p.rating ?? '',
    route: p.route ?? '',
    component: p.component ?? '',
    message: p.message ?? '',
    stack: p.stack ?? '',
    timestamp: p.timestamp,
    sample: p.sample ?? 1,
    device: p.device ?? {},
    extra: typeof p.extra === 'string' ? p.extra : JSON.stringify(p.extra),
  };
}
