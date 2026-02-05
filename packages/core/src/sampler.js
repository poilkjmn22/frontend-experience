let sampleRate = 1;
export function initSampler(rate = 1) {
    sampleRate = rate;
}
export function shouldSample() {
    if (sampleRate >= 1)
        return true;
    return Math.random() < sampleRate;
}
//# sourceMappingURL=sampler.js.map