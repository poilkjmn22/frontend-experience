import React, { Profiler } from 'react';
import { report } from '@whnz/frontend-experience-core';
import { jsx } from 'react/jsx-runtime';

// src/ErrorBoundary.ts
var ErrorBoundary = class extends React.Component {
  componentDidCatch(error, info) {
    report({
      type: "react-error",
      timestamp: Date.now(),
      extra: {
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack
      }
    });
  }
  render() {
    return this.props.children;
  }
};
function withProfiler(Component, id) {
  return function ProfiledComponent(props) {
    return /* @__PURE__ */ jsx(
      Profiler,
      {
        id,
        onRender: (_, phase, actualDuration) => {
          if (actualDuration > 30) {
            report({
              type: "react-render",
              duration: actualDuration,
              timestamp: Date.now(),
              extra: { id, phase }
            });
          }
        },
        children: /* @__PURE__ */ jsx(Component, { ...props })
      }
    );
  };
}

export { ErrorBoundary, withProfiler };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map