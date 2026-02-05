export function now() {
    return (performance === null || performance === void 0 ? void 0 : performance.now) ? Math.round(performance.now()) : Date.now();
}
//# sourceMappingURL=utils.js.map