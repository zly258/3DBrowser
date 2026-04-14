export declare function processChunkPrefetchQueue(options: {
    prefetchPaused: boolean;
    isCameraMoving: boolean;
    prefetchQueue: string[];
    prefetchQueueSet: Set<string>;
    prefetchInFlight: Set<string>;
    maxWorkers: number;
    getChunkById: (chunkId: string) => any;
    chunkReadCache: Map<string, ArrayBuffer>;
    readChunkBuffer: (chunk: any) => Promise<ArrayBuffer>;
    processQueue: () => Promise<void> | void;
}): Promise<void>;
