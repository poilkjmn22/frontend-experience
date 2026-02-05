import { onFCP, onLCP, onCLS, onINP } from 'web-vitals';
import { report } from '@whnz/frontend-experience-core';
export function vitalsPlugin() {
    return {
        name: 'vitals',
        setup() {
            onFCP((m) => report({
                type: 'fcp',
                value: m.value,
                timestamp: Date.now(),
            }));
            onLCP((m) => {
                var _a, _b, _c;
                return report({
                    type: 'lcp',
                    value: m.value,
                    timestamp: Date.now(),
                    extra: {
                        element: (_c = (_b = (_a = m.entries) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.element) === null || _c === void 0 ? void 0 : _c.tagName,
                    },
                });
            });
            onCLS((m) => report({
                type: 'cls',
                value: m.value,
                timestamp: Date.now(),
            }));
            onINP((m) => {
                if (m.value > 200) {
                    report({
                        type: 'inp',
                        value: m.value,
                        timestamp: Date.now(),
                    });
                }
            });
        },
    };
}
//# sourceMappingURL=index.js.map