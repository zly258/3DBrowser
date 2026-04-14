export declare function getChunkReadCacheKey(chunk: any): string;
export declare function hasValidChunkBinaryRange(chunk: any): boolean;
export declare function touchChunkReadCache(cacheOrder: string[], cacheKey: string): string[];
export declare function putChunkReadCache(options: {
    chunkReadCache: Map<string, ArrayBuffer>;
    chunkReadCacheOrder: string[];
    cacheKey: string;
    buffer: ArrayBuffer;
    chunkReadCacheSize: number;
}): string[];
export declare function readChunkBuffer(options: {
    chunk: any;
    nbimFiles: Map<string, File>;
    chunkReadCache: Map<string, ArrayBuffer>;
    chunkReadCacheOrder: string[];
    chunkReadCacheSize: number;
}): Promise<{
    buffer: ArrayBuffer;
    chunkReadCacheOrder: string[];
}>;
export declare function enqueueChunkPrefetch(options: {
    chunkIds: string[];
    chunkPrefetchWindow: number;
    prefetchQueue: string[];
    prefetchQueueSet: Set<string>;
    prefetchInFlight: Set<string>;
}): string[];
export declare function collectPrefetchCandidates(options: {
    visibleChunks: any[];
    chunkPrefetchWindow: number;
    prefetchPaused: boolean;
    isCameraMoving: boolean;
    prefetchRoundRobinCursor: number;
    chunks: any[];
    processingChunks: Set<string>;
    chunkReadCache: Map<string, ArrayBuffer>;
    getChunkIndex: (chunkId: string) => number;
}): {
    chunkIds: string[];
    prefetchRoundRobinCursor: number;
};
