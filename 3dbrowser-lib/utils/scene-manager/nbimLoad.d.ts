import * as THREE from "three";
import type { StructureTreeNode } from "./types";
export declare function applyNbimGlobalBounds(options: {
    globalBounds?: {
        min: {
            x: number;
            y: number;
            z: number;
        };
        max: {
            x: number;
            y: number;
            z: number;
        };
    };
    precomputedBounds: THREE.Box3;
    sceneBounds: THREE.Box3;
    globalOffset: THREE.Vector3;
}): {
    precomputedBounds: THREE.Box3;
    sceneBounds: THREE.Box3;
    globalOffset: THREE.Vector3;
    initializedOffset: boolean;
};
export declare function appendNbimStructure(options: {
    structureRoot: StructureTreeNode;
    modelRoot?: StructureTreeNode;
}): StructureTreeNode;
export declare function buildNbimQuickStats(options: {
    manifestStats?: {
        meshes: number;
        faces: number;
        memory: number;
    };
    modelRoot?: StructureTreeNode;
    chunks?: Array<{
        byteLength?: number;
    }>;
}): {
    meshes: number;
    faces: number;
    memory: number;
};
export declare function populateNbimNodeMappings(options: {
    modelRoot?: StructureTreeNode;
    defaultOwner: string;
    nodeMap: Map<string, StructureTreeNode[]>;
    bimIdToNodeIds: Map<string, string[]>;
}): void;
export declare function registerNbimChunks(options: {
    chunkEntries: any[];
    globalOffset: THREE.Vector3;
    chunkPadding: number;
    rootId: string;
    fileId: string;
    immediateGhostLimit: number;
    registrationBatchSize: number;
    onProgress?: (p: number, msg: string) => void;
    registerChunk: (chunk: any) => void;
    createGhostLine: (name: string, bounds: THREE.Box3) => THREE.LineSegments;
    addGhostLine: (line: THREE.LineSegments) => void;
    yieldToMainThread: () => Promise<void>;
}): Promise<{
    deferredGhostSpecs: {
        chunkId: string;
        bounds: THREE.Box3;
    }[];
}>;
export declare function finalizeNbimLoad(options: {
    chunkCount: number;
    hasManifestStats: boolean;
    hasManifestChunks: boolean;
}): {
    chunkWarmupActive: boolean;
    initialChunkLoadTarget: number;
    shouldEstimateStats: boolean;
};
