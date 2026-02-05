export function now() {
  return performance?.now ? Math.round(performance.now()) : Date.now();
}
