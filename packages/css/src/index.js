import { report } from '@whnz/frontend-experience-core';
function detectWhiteScreen(delay = 3000) {
    setTimeout(() => {
        const elements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        const isWhite = elements.every((el) => ['HTML', 'BODY'].includes(el.tagName));
        if (isWhite) {
            report({
                type: 'white-screen',
                timestamp: Date.now(),
            });
        }
    }, delay);
}
function checkVisibility(selector) {
    const el = document.querySelector(selector);
    if (!el)
        return;
    const rect = el.getBoundingClientRect();
    const visible = rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight;
    if (!visible) {
        report({
            type: 'css-visibility-error',
            timestamp: Date.now(),
            extra: { selector },
        });
    }
}
export function cssPlugin(options = {}) {
    return {
        name: 'css',
        setup() {
            var _a;
            if (options.detectWhiteScreen !== false) {
                detectWhiteScreen();
            }
            if ((_a = options.keySelectors) === null || _a === void 0 ? void 0 : _a.length) {
                requestIdleCallback(() => {
                    options.keySelectors.forEach(checkVisibility);
                });
            }
        },
    };
}
//# sourceMappingURL=index.js.map