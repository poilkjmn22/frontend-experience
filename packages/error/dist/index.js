import { report } from '@whnz/frontend-experience-core';

// src/index.ts
function errorPlugin() {
  return {
    name: "error",
    setup() {
      window.addEventListener("error", (event) => {
        var _a;
        report({
          type: "js-error",
          timestamp: Date.now(),
          message: event.message,
          stack: (_a = event.error) == null ? void 0 : _a.stack,
          extra: {
            file: event.filename,
            line: event.lineno,
            col: event.colno
          }
        });
      });
      window.addEventListener("unhandledrejection", (event) => {
        report({
          type: "promise-error",
          timestamp: Date.now(),
          extra: {
            reason: String(event.reason)
          }
        });
      });
    }
  };
}

export { errorPlugin };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map