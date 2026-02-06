import { ReportPayload } from '../schema/report';
export function normalize(p: ReportPayload) {
  return {
    ts: new Date(p.ts),
    app: p.app,
    env: p.env,
    version: p.version ?? '',
    type: p.type,
    name: p.name,
    value: p.value ?? 0,
    rating: p.rating ?? '',
    route: p.route ?? '',
    component: p.component ?? '',
    message: p.message ?? '',
    stack: p.stack ?? '',
    ua: p.device?.ua ?? '',
    network: p.device?.network ?? '',
  };
}
