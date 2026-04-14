export type ChunkRenderPhase = "moving" | "recovery" | "idle";
export interface ChunkRuntimeProfileLike {
    movingCoreCentralityThreshold: number;
    movingCorePixelThreshold: number;
    movingCoreForwardThreshold: number;
    movingPeripheralRefreshMs: number;
    movingPeripheralBatchRatio: number;
    movingPeripheralMinBatchSize: number;
    movingLoadBudgetMin: number;
    movingLoadBudgetMax: number;
    recoveryLoadBudgetMin: number;
    recoveryLoadBudgetMax: number;
    recoveryLoadBudgetRatio: number;
}
export declare function reportChunkProgressIfNeeded(options: {
    now: number;
    total: number;
    loaded: number;
    lastReportedProgress: {
        loaded: number;
        total: number;
    };
    lastChunkProgressReportAt: number;
}): {
    shouldNotify: boolean;
    nextProgress: {
        loaded: number;
        total: number;
    };
    nextReportedAt: number;
};
export declare function selectChunkRuntimeProfile<TProfile>(options: {
    chunkCount: number;
    compact: TProfile;
    balanced: TProfile;
    massive: TProfile;
}): TProfile;
export declare function computeChunkFrameBudget(options: {
    forceMaxChunkLoadSpeed: boolean;
    maxChunkLoadsPerFrame: number;
    performanceMode: "balanced" | "smooth" | "quality";
    chunkCount: number;
    phase: ChunkRenderPhase;
    profile: ChunkRuntimeProfileLike;
    warmupExtra: number;
}): number;
export declare function isMovingPeripheralChunk(options: {
    centrality: number;
    pixelSize: number;
    forwardness: number;
    profile: ChunkRuntimeProfileLike;
}): boolean;
export declare function updatePeripheralRefreshWindow(options: {
    now: number;
    isCameraMoving: boolean;
    chunkIndex: number;
    totalChunks: number;
    profile: ChunkRuntimeProfileLike;
    movingPeripheralCursor: number;
    movingPeripheralLastRefreshAt: number;
}): {
    shouldRefresh: boolean;
    movingPeripheralCursor: number;
    movingPeripheralLastRefreshAt: number;
};
