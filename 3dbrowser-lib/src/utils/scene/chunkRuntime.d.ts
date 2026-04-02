import { PerformancePreset } from "./types";
export interface AdaptiveRuntimeInput {
    hardwareConcurrency: number;
    frameDeltaMs: number;
    targetMinFps: number;
    currentConcurrentLoads: number;
    currentFrameBudget: number;
}
export interface AdaptiveRuntimeOutput {
    nextConcurrentLoads: number;
    nextFrameBudget: number;
}
export declare function deriveInitialRuntimeFromHardware(cpuCount: number, preset: PerformancePreset): {
    maxConcurrentChunkLoads: number;
    maxChunkLoadsPerFrame: number;
};
export declare function adaptChunkRuntime(input: AdaptiveRuntimeInput): AdaptiveRuntimeOutput;
