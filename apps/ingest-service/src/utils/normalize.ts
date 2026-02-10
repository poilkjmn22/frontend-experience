import { ReportPayload } from '../schema/report';
export function normalize(payload: ReportPayload) {
  return {
    app: payload.app,
    env: payload.env,
    version: payload.version ?? '',
    type: payload.type,
    name: payload.name ?? '',
    route: payload.route ?? '',
    component: payload.component ?? '',

    timestamp: new Date(payload.timestamp),
    value: payload.value ?? 0,
    duration: payload.duration ?? 0,
    rating: payload.rating ?? '',

    message: payload.message ?? '',
    stack: payload.stack ?? '',

    ua: payload.device?.ua ?? '',
    network: payload.device?.network ?? '',

    sample: payload.sample ?? 1,
    extra: JSON.stringify(payload.extra ?? {}),
  };
}
