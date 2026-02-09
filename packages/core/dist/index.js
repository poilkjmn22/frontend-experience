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
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          fn,
          new Blob([JSON.stringify(event)], { type: "application/json" })
        );
      } else {
        fetch(fn, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(event),
          keepalive: true,
          credentials: "omit"
        }).catch(() => {
        });
      }
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
    reporterFn(payload);
  } catch (e) {
  }
}
var queue = [];
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    flushSync();
  }
});
function flushSync() {
  if (!queue.length) return;
  const batch = queue.splice(0);
  reporterFn == null ? void 0 : reporterFn(batch);
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