import * as THREE from "three";
export declare function applyUnloadChunk(options: {
    chunk: any;
    unregisterOptimizedMeshMapping: (mesh: THREE.BatchedMesh) => void;
    cacheChunkMesh: (chunk: any, mesh: THREE.BatchedMesh) => void;
    ensureChunkGhost: (chunk: any) => void;
}): {
    changed: boolean;
    chunkLoadedCountDelta: number;
};
export declare function resolveChunkMeshForLoad(options: {
    chunk: any;
    sharedMaterial: THREE.Material;
    takeCachedChunkMesh: (chunkId: string) => THREE.BatchedMesh | null;
    yieldToMainThread: () => Promise<void>;
    nbimFiles: Map<string, File>;
    hasValidChunkBinaryRange: (chunk: any) => boolean;
    readChunkBuffer: (chunk: any) => Promise<ArrayBuffer>;
    nbimMeta: Map<string, any>;
    runWorkerTask: (data: any, transferables: any[]) => Promise<any>;
    reconstructBatchedMesh: (data: any, material: THREE.Material) => THREE.BatchedMesh | null;
    isCameraMoving: boolean;
    chunkPrefetchWindow: number;
    getChunkIndex: (chunkId: string) => number;
    chunks: any[];
    processingChunks: Set<string>;
}): Promise<{
    mesh: THREE.BatchedMesh;
    prefetchCandidates: string[];
}>;
export declare function attachLoadedChunkMesh(options: {
    chunk: any;
    mesh: THREE.BatchedMesh;
    cancelledChunkIds: Set<string>;
    chunkIdSet: Set<string>;
    disposeChunkMesh: (mesh: THREE.BatchedMesh) => void;
    globalOffset: THREE.Vector3;
    contentGroup: THREE.Group;
    registerOptimizedMeshMapping: (mesh: THREE.BatchedMesh) => void;
}): {
    attached: boolean;
};
export declare function finalizeLoadedChunk(options: {
    chunk: any;
    loadedNow: boolean;
    now: number;
    chunkLoadedCount: number;
    chunkWarmupActive: boolean;
    initialChunkLoadTarget: number;
    deactivateFastPreviewForModel: (originalUuid: string) => void;
}): {
    nextChunkLoadedCount: number;
    nextChunkWarmupActive: boolean;
    progressChanged: boolean;
};
export declare function cleanupChunkGhost(options: {
    chunkId: string;
    ghostGroup: THREE.Group;
    releaseGhostLine: (line: THREE.LineSegments) => void;
}): {
    changed: boolean;
};
