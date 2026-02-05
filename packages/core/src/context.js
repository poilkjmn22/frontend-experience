const context = {
    app: '',
    version: '',
    env: 'prod',
    route: '/',
};
export function initContext(partial) {
    Object.assign(context, partial);
}
export function setRoute(route) {
    context.route = route;
}
export function setUserId(userId) {
    context.userId = userId;
}
export function getContext() {
    return { ...context };
}
//# sourceMappingURL=context.js.map