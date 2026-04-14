import * as THREE from "three";
export declare function disposeChunkMeshResource(options: {
    mesh: THREE.BatchedMesh;
    sharedMaterial: THREE.Material;
}): void;
export declare function touchChunkMeshCacheOrder(chunkCacheOrder: string[], chunkId: string): string[];
export declare function cacheChunkMeshEntry(options: {
    chunk: any;
    mesh: THREE.BatchedMesh;
    chunkMeshCache: Map<string, THREE.BatchedMesh>;
    chunkCacheOrder: string[];
    maxCachedChunks: number;
    disposeChunkMesh: (mesh: THREE.BatchedMesh) => void;
}): {
    chunkMeshCache: Map<string, THREE.BatchedMesh>;
    chunkCacheOrder: string[];
};
export declare function takeCachedChunkMeshEntry(options: {
    chunkId: string;
    chunkMeshCache: Map<string, THREE.BatchedMesh>;
    chunkCacheOrder: string[];
}): {
    mesh: any;
    chunkCacheOrder: string[];
};
export declare function clearChunkMeshCacheEntries(options: {
    chunkMeshCache: Map<string, THREE.BatchedMesh>;
    chunkCacheOrder: string[];
    disposeChunkMesh: (mesh: THREE.BatchedMesh) => void;
    filter?: (chunkId: string, mesh: THREE.BatchedMesh) => boolean;
}): string[];
export declare function unregisterOptimizedMeshResourceMapping(options: {
    mesh: THREE.BatchedMesh;
    optimizedMapping: Map<string, any[]>;
}): void;
export declare function registerOptimizedMeshResourceMapping(options: {
    mesh: THREE.BatchedMesh;
    optimizedMapping: Map<string, any[]>;
}): void;
export declare function acquireGhostLineResource(options: {
    ghostMeshPool: THREE.LineSegments[];
    ghostEdgesGeometry: THREE.BufferGeometry;
    ghostMaterial: THREE.Material;
}): any;
export declare function releaseGhostLineResource(options: {
    line: THREE.LineSegments;
    ghostMeshPool: THREE.LineSegments[];
}): void;
export declare function createGhostLineResource(options: {
    name: string;
    bounds: THREE.Box3;
    acquireGhostLine: () => THREE.LineSegments;
}): THREE.LineSegments;
export declare function ensureChunkGhostResource(options: {
    chunk: any;
    ghostGroup: THREE.Group;
    createGhostLine: (name: string, bounds: THREE.Box3) => THREE.LineSegments;
}): void;
