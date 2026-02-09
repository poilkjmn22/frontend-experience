import { vitalsPlugin } from '@whnz/frontend-experience-vitals';
import { errorPlugin } from '@whnz/frontend-experience-error';
import { cssPlugin } from '@whnz/frontend-experience-css';
import { report } from '@whnz/frontend-experience-core';

// src/index.ts
var lastPath = location.pathname + location.search;
var routeStart = performance.now();
function onRouteChange(to) {
  const now = performance.now();
  const duration = now - routeStart;
  report({
    type: "route",
    duration,
    timestamp: Date.now(),
    extra: {
      from: lastPath,
      to,
      startTime: routeStart,
      success: true
    }
  });
  lastPath = to;
  routeStart = now;
}
function initRouteObserver() {
  const rawPushState = history.pushState;
  const rawReplaceState = history.replaceState;
  history.pushState = function(...args) {
    rawPushState.apply(this, args);
    onRouteChange(location.pathname + location.search);
  };
  history.replaceState = function(...args) {
    rawReplaceState.apply(this, args);
    onRouteChange(location.pathname + location.search);
  };
  window.addEventListener("popstate", () => {
    onRouteChange(location.pathname + location.search);
  });
}
function routePlugin() {
  return {
    name: "route",
    setup() {
      initRouteObserver();
    }
  };
}
function initLongTaskObserver(options) {
  if (!PerformanceObserver.supportedEntryTypes.includes("longtask")) return;
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries().filter((e) => e.duration > ((options == null ? void 0 : options.blockingThreshold) || 50));
    if (!entries.length) return;
    entries.forEach((entry) => {
      console.log(entry, "longtask entry");
      report({
        type: "longtask",
        duration: entry.duration,
        timestamp: Date.now(),
        extra: {
          startTime: entry.startTime,
          blockingTime: Math.max(
            0,
            entry.duration - ((options == null ? void 0 : options.blockingThreshold) || 50)
          ),
          name: entry.name
        }
      });
    });
  });
  observer.observe({ entryTypes: ["longtask"] });
}
function longTaskPlugin(options) {
  return {
    name: "longtask",
    setup() {
      initLongTaskObserver(options);
    }
  };
}

// src/index.ts
function spaPreset(options = {}) {
  return [
    vitalsPlugin(),
    errorPlugin(),
    cssPlugin({
      keySelectors: options.keySelectors,
      detectWhiteScreen: true
    }),
    routePlugin(),
    longTaskPlugin({
      reportInterval: options.reportInterval,
      blockingThreshold: options.blockingThreshold
    })
  ];
}

export { spaPreset };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map