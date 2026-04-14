import type { ChunkRenderPhase, ChunkRuntimeProfileLike } from "./chunkScheduling";
export declare function selectChunksToUnload(options: {
    isCameraMoving: boolean;
    loadedChunks: any[];
    maxLoadedChunks: number;
    cameraPos: {
        distanceToSquared(target: any): number;
    };
    now: number;
    chunkResidencyMs: number;
}): any[];
export declare function planChunkLoads<TProfile extends ChunkRuntimeProfileLike>(options: {
    toLoad: any[];
    now: number;
    chunkLoadResumeAt: number;
    maxConcurrentChunkLoads: number;
    processingChunkCount: number;
    chunkWarmupActive: boolean;
    chunkLoadedCount: number;
    initialChunkLoadTarget: number;
    warmupChunkBoost: number;
    getChunkFrameBudget: (phase: ChunkRenderPhase, profile: TProfile, warmupExtra: number) => number;
    phase: ChunkRenderPhase;
    profile: TProfile;
}): any[];
