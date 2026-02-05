import { jsx as _jsx } from "react/jsx-runtime";
import { Profiler } from 'react';
import { report } from '@whnz/frontend-experience-core';
export function withProfiler(Component, id) {
    return function ProfiledComponent(props) {
        return (_jsx(Profiler, { id: id, onRender: (_, phase, actualDuration) => {
                if (actualDuration > 30) {
                    report({
                        type: 'react-render',
                        duration: actualDuration,
                        timestamp: Date.now(),
                        extra: { id, phase }
                    });
                }
            }, children: _jsx(Component, { ...props }) }));
    };
}
//# sourceMappingURL=Profiler.js.map