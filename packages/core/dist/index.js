// src/context.ts
var context = {
  app: "",
  version: "",
  env: "prod",
  route: "/"
};
function initContext(partial) {
  Object.assign(context, partial);
}
function setRoute(route) {
  context.route = route;
}
function setUserId(userId) {
  context.userId = userId;
}
function getContext() {
  return { ...context };
}

// src/sampler.ts
var sampleRate = 1;
function initSampler(rate = 1) {
  sampleRate = rate;
}
function shouldSample() {
  if (sampleRate >= 1) return true;
  return Math.random() < sampleRate;
}

// src/reporter.ts
var reporterFn = null;
function initReporter(fn) {
  if (typeof fn === "string") {
    reporterFn = (event) => {
      navigator.sendBeacon(fn, JSON.stringify(event));
    };
  } else {
    reporterFn = fn;
  }
}
function report(event) {
  if (!reporterFn) return;
  if (!shouldSample()) return;
  const payload = {
    ...event,
    ...getContext(),
    timestamp: event.timestamp || Date.now()
  };
  try {
    enqueue(payload);
  } catch (e) {
  }
}
var queue = [];
var flushing = false;
function enqueue(payload) {
  queue.push(payload);
  scheduleFlush();
}
function scheduleFlush() {
  if (flushing) return;
  flushing = true;
  requestIdleCallback(
    () => {
      flush();
      flushing = false;
    },
    { timeout: 2e3 }
  );
}
function flush() {
  if (!queue.length) return;
  const batch = queue.splice(0, 20);
  reporterFn == null ? void 0 : reporterFn(batch.length === 1 ? batch[0] : batch);
}

// src/init.ts
var inited = false;
function initCore(options) {
  var _a;
  if (inited) return;
  inited = true;
  initContext({
    app: options.app,
    version: options.version,
    env: options.env,
    route: location.pathname
  });
  initReporter(options.reporter);
  initSampler((_a = options.sampleRate) != null ? _a : 1);
}

export { getContext, initCore, report, setRoute, setUserId };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map