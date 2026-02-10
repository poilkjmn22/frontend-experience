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
function setDeviceInfo(ua, network) {
  context.device = { ua, network };
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
        navigator.sendBeacon(fn, JSON.stringify(event));
      } else {
        fetch(fn, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=UTF-8"
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
  setRoute(location.pathname);
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
  var _a, _b;
  if (inited) return;
  inited = true;
  initContext({
    app: options.app,
    version: options.version,
    env: options.env,
    route: location.pathname,
    device: {
      ua: navigator.userAgent,
      network: ((_a = navigator.connection) == null ? void 0 : _a.effectiveType) || ""
    }
  });
  initReporter(options.reporter);
  initSampler((_b = options.sample) != null ? _b : 1);
}

export { getContext, initCore, report, setDeviceInfo, setRoute };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map