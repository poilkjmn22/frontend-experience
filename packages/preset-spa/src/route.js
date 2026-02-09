import { report } from '@whnz/frontend-experience-core';
let lastPath = location.pathname + location.search;
let routeStart = performance.now();
function onRouteChange(to) {
    const now = performance.now();
    const duration = now - routeStart;
    report({
        type: 'route',
        duration,
        timestamp: Date.now(),
        extra: {
            from: lastPath,
            to,
            startTime: routeStart,
            success: true,
        },
    });
    lastPath = to;
    routeStart = now;
}
function initRouteObserver() {
    const rawPushState = history.pushState;
    const rawReplaceState = history.replaceState;
    history.pushState = function (...args) {
        rawPushState.apply(this, args);
        onRouteChange(location.pathname + location.search);
    };
    history.replaceState = function (...args) {
        rawReplaceState.apply(this, args);
        onRouteChange(location.pathname + location.search);
    };
    window.addEventListener('popstate', () => {
        onRouteChange(location.pathname + location.search);
    });
}
export function routePlugin() {
    return {
        name: 'route',
        setup() {
            initRouteObserver();
        },
    };
}
//# sourceMappingURL=route.js.map