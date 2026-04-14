export interface ChunkWorkerTask {
    resolve: (value: any) => void;
    reject: (reason?: unknown) => void;
    data: any;
    transferables: any[];
}
export declare function queueChunkWorkerTask(options: {
    workerQueue: ChunkWorkerTask[];
    data: any;
    transferables: any[];
    processQueue: () => void;
}): Promise<unknown>;
export declare function processChunkWorkerQueue(options: {
    activeWorkerCount: number;
    maxWorkers: number;
    workerQueue: ChunkWorkerTask[];
    workers: Worker[];
    createWorker: () => Worker;
    getActiveWorkerCount: () => number;
    onActiveWorkerCountChange: (count: number) => void;
    processQueue: () => void;
}): void;
export declare function disposeChunkWorkerPool(options: {
    workers: Worker[];
    workerQueue: ChunkWorkerTask[];
    rejectReason: string;
}): void;
